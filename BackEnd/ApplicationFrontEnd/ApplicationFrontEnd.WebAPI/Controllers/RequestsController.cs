using ApplicationFrontEnd.Core;
using ApplicationFrontEnd.Core.Interfaces;
using ApplicationFrontEnd.Core.Services;
using ApplicationFrontEnd.WebAPI.Dtos;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApplicationFrontEnd.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RequestsController : ControllerBase
    {
        private readonly IRequestRepository _requestRepository;
        private readonly IContribuableRepository _contribuableRepository;
        private readonly IValidationService _validationService;
        private readonly IAvisCotisationService _avisCotisationService;
        private readonly IMapper _mapper;

        public RequestsController(
            IRequestRepository requestRepository,
            IContribuableRepository contribuableRepository,
            IValidationService validationService,
            IAvisCotisationService avisCotisationService,
            IMapper mapper)
        {
            _requestRepository = requestRepository;
            _contribuableRepository = contribuableRepository;
            _validationService = validationService;
            _avisCotisationService = avisCotisationService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RequestDto>>> GetRequests()
        {
            var requests = await _requestRepository.ListAllAsync();
            return Ok(_mapper.Map<IEnumerable<RequestDto>>(requests));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RequestDto>> GetRequest(int id)
        {
            var request = await _requestRepository.GetByIdWithRequestItemsAsync(id);
            if (request == null) return NotFound();
            return Ok(_mapper.Map<RequestDto>(request));
        }

        [HttpGet("contribuable/{contribuableId}")]
        public async Task<ActionResult<IEnumerable<RequestDto>>> GetRequestsByContribuable(int contribuableId)
        {
            try
            {
                var requests = await _requestRepository.GetByContribuableIdAsync(contribuableId);
                return Ok(_mapper.Map<IEnumerable<RequestDto>>(requests));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur interne du serveur: {ex.Message}");
            }
        }

        [HttpGet("statut/{statut}")]
        public async Task<ActionResult<IEnumerable<RequestDto>>> GetRequestsByStatut(StatutRequest statut)
        {
            var requests = await _requestRepository.GetByStatutAsync(statut);
            return Ok(_mapper.Map<IEnumerable<RequestDto>>(requests));
        }

        [HttpPost]
        public async Task<ActionResult<RequestDto>> CreateRequest(RequestCreateDto requestDto)
        {
            var contribuable = await _contribuableRepository.GetByIdAsync(requestDto.ContribuableId);
            if (contribuable == null) return BadRequest("Contribuable non trouvé");

            var request = _mapper.Map<Request>(requestDto);
            request.Contribuable = contribuable;

            var result = await _requestRepository.AddAsync(request);
            return CreatedAtAction(nameof(GetRequest), new { id = result.Id }, _mapper.Map<RequestDto>(result));
        }

        [HttpPost("{id}/soumettre")]
        public async Task<IActionResult> SoumettreDeclaration(int id)
        {
            try
            {
                var request = await _requestRepository.GetByIdWithRequestItemsAsync(id);
                if (request == null) return NotFound();

                // Validation automatique de la déclaration
                var resultatValidation = await _validationService.ValiderDeclaration(request);

                // DÉBUT CORRECTION: Vérifier d'abord si c'est éligible pour approbation automatique
                if (resultatValidation.EstValide && DoitEtreApprouveAutomatiquement(resultatValidation, request))
                {
                    // RÈGLE 1: Aucune erreur ET éligible → Traitement automatique IMMÉDIAT
                    request.Soumettre();

                    // Générer avis automatique IMMÉDIATEMENT
                    var avis = await _avisCotisationService.GenererAvisAutomatique(request);
                    request.AvisCotisation = avis;
                    request.Statut = StatutRequest.ApprouveAutomatique;

                    await _requestRepository.UpdateAsync(request);

                    return Ok(new
                    {
                        message = "Déclaration soumise et approuvée automatiquement",
                        statut = request.Statut,
                        avis = _mapper.Map<AvisCotisationDto>(avis),
                        validation = new
                        {
                            estValide = resultatValidation.EstValide,
                            erreurs = resultatValidation.Erreurs,
                            avertissements = resultatValidation.Avertissements
                        }
                    });
                }
                else if (resultatValidation.EstValide)
                {
                    // RÈGLE 2: Valide mais nécessite révision manuelle (ex: revenus > 30,000$)
                    request.Soumettre();
                    request.Statut = StatutRequest.EnRevision;

                    await _requestRepository.UpdateAsync(request);

                    return Ok(new
                    {
                        message = "Déclaration soumise et nécessite une révision manuelle",
                        statut = request.Statut,
                        validation = new
                        {
                            estValide = resultatValidation.EstValide,
                            erreurs = resultatValidation.Erreurs,
                            avertissements = resultatValidation.Avertissements
                        }
                    });
                }
                else
                {
                    // RÈGLE 3: Non valide → révision manuelle (pas de rejet automatique)
                    request.Soumettre();
                    request.Statut = StatutRequest.EnRevision; // Toujours en révision, jamais rejeté automatiquement

                    await _requestRepository.UpdateAsync(request);

                    return Ok(new
                    {
                        message = "Déclaration soumise avec des erreurs nécessitant une révision",
                        statut = request.Statut,
                        validation = new
                        {
                            estValide = resultatValidation.EstValide,
                            erreurs = resultatValidation.Erreurs,
                            avertissements = resultatValidation.Avertissements
                        }
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur lors de la soumission: {ex.Message}");
            }
        }
        private bool DoitEtreApprouveAutomatiquement(ValidationResult resultat, Request declaration)
        {
            // CRITÈRE UNIQUE : seulement le montant des revenus
            return declaration.TotalRevenus <= 30000;
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<RequestDto>> UpdateRequest(int id, RequestCreateDto requestDto)
        {
            try
            {
                var existingRequest = await _requestRepository.GetByIdAsync(id);
                if (existingRequest == null) return NotFound();

                _mapper.Map(requestDto, existingRequest);
                await _requestRepository.UpdateAsync(existingRequest);

                return Ok(_mapper.Map<RequestDto>(existingRequest));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur interne du serveur: {ex.Message}");
            }
        }

        [HttpPost("{id}/rejeter")]
        public async Task<IActionResult> RejeterDeclaration(int id)
        {
            var request = await _requestRepository.GetByIdAsync(id);
            if (request == null) return NotFound();

            request.Statut = StatutRequest.Rejetee;
            await _requestRepository.UpdateAsync(request);

            return Ok(new { message = "Déclaration rejetée avec succès", statut = request.Statut });
        }
    }
}