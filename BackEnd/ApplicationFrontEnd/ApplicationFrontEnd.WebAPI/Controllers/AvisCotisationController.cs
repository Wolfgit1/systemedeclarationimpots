using ApplicationFrontEnd.Core;
using ApplicationFrontEnd.Core.Interfaces;
using ApplicationFrontEnd.WebAPI.Dtos;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ApplicationFrontEnd.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AvisCotisationController : ControllerBase
    {
        private readonly IRequestRepository _requestRepository;
        private readonly IMapper _mapper;

        public AvisCotisationController(IRequestRepository requestRepository, IMapper mapper)
        {
            _requestRepository = requestRepository;
            _mapper = mapper;
        }

        [HttpGet("declaration/{declarationId}")]
        public async Task<ActionResult<AvisCotisationDto>> GetAvisByDeclaration(int declarationId)
        {
            try
            {
                var declaration = await _requestRepository.GetByIdWithAvisAsync(declarationId);

                if (declaration == null)
                    return NotFound("Déclaration non trouvée");

                if (declaration.AvisCotisation == null)
                    return NotFound("Avis de cotisation non trouvé pour cette déclaration");

                // Éviter la référence circulaire en ne mappant que l'avis
                var avisDto = _mapper.Map<AvisCotisationDto>(declaration.AvisCotisation);

                // Ne pas inclure la déclaration dans la réponse pour éviter la circularité
                avisDto.Request = null;

                return Ok(avisDto);
            }
            catch (Exception ex)
            {
                // Log l'erreur complète pour le débogage
                Console.WriteLine($"Erreur détaillée: {ex}");
                return StatusCode(500, $"Erreur interne du serveur: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AvisCotisationDto>> GetAvis(int id)
        {
            try
            {
                var declarations = await _requestRepository.ListAllAsync();
                var declaration = declarations.FirstOrDefault(d => d.AvisCotisation?.Id == id);

                if (declaration?.AvisCotisation == null)
                    return NotFound("Avis de cotisation non trouvé");

                return Ok(_mapper.Map<AvisCotisationDto>(declaration.AvisCotisation));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur interne du serveur: {ex.Message}");
            }
        }

        [HttpPost("generer-automatique/{declarationId}")]
        public async Task<ActionResult<AvisCotisationDto>> GenererAvisAutomatique(int declarationId)
        {
            try
            {
                var declaration = await _requestRepository.GetByIdAsync(declarationId);
                if (declaration == null)
                    return NotFound("Déclaration non trouvée");

                // Calcul de l'impôt avec un algorithme simple
                var montantAPayer = CalculerImpotAutomatique(declaration);

                var avis = new AvisCotisation
                {
                    NumeroReference = $"RQ-{DateTime.Now.Year}-{declarationId:D8}-AUTO",
                    DateGeneration = DateTime.Now,
                    MontantAPayer = montantAPayer,
                    EstAutomatique = true,
                    RequestId = declarationId,
                    Request = declaration
                };

                declaration.AvisCotisation = avis;
                declaration.Statut = StatutRequest.ApprouveAutomatique;
                await _requestRepository.UpdateAsync(declaration);

                return Ok(_mapper.Map<AvisCotisationDto>(avis));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur interne du serveur: {ex.Message}");
            }
        }

        private decimal CalculerImpotAutomatique(Request declaration)
        {
            // Algorithme simplifié de calcul d'impôt
            var revenuImposable = declaration.TotalRevenus;

            // Seuils d'imposition fictifs pour le Québec
            if (revenuImposable <= 15000)
                return 0; // Non imposable
            else if (revenuImposable <= 30000)
                return revenuImposable * 0.15m; // 15% pour les petites déclarations
            else
                return revenuImposable * 0.20m; // 20% pour déclarations plus élevées
        }

        [HttpPost("generer-personnalise/{declarationId}")]
        public async Task<ActionResult<AvisCotisationDto>> GenererAvisPersonnalise(int declarationId, [FromBody] string motifsAjustement)
        {
            try
            {
                var declaration = await _requestRepository.GetByIdAsync(declarationId);
                if (declaration == null)
                    return NotFound("Déclaration non trouvée");

                var avis = new AvisCotisation
                {
                    NumeroReference = $"RQ-{DateTime.Now.Year}-{declarationId:D8}-P",
                    DateGeneration = DateTime.Now,
                    MontantAPayer = declaration.CalculerImpôt() * 1.1m, // Exemple d'ajustement
                    EstAutomatique = false,
                    MotifsAjustement = motifsAjustement,
                    RequestId = declarationId,
                    Request = declaration
                };

                declaration.AvisCotisation = avis;
                declaration.Statut = StatutRequest.ApprouveAgent;
                await _requestRepository.UpdateAsync(declaration);

                return Ok(_mapper.Map<AvisCotisationDto>(avis));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur interne du serveur: {ex.Message}");
            }
        }
    }

    public class AvisCotisationCreateDto
    {
        public string NumeroReference { get; set; } = string.Empty;
        public DateTime DateGeneration { get; set; }
        public decimal MontantAPayer { get; set; }
        public bool EstAutomatique { get; set; }
        public string? MotifsAjustement { get; set; }
        public int RequestId { get; set; }
    }
}