using ApplicationFrontEnd.Core;
using ApplicationFrontEnd.Core.Interfaces;
using ApplicationFrontEnd.WebAPI.Dtos;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationFrontEnd.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IContribuableRepository _contribuableRepository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;

        public AuthController(IContribuableRepository contribuableRepository, IMapper mapper, IConfiguration config)
        {
            _contribuableRepository = contribuableRepository;
            _mapper = mapper;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            try
            {
                // Vérification du compte admin simple
                if (loginDto.Email == "admin@admin.com" && loginDto.MotDePasse == "password")
                {
                    var token = GenerateJwtTokenForAdmin();

                    return Ok(new
                    {
                        token = token,
                        user = new
                        {
                            id = 0,
                            email = "admin",
                            prenom = "Administrateur",
                            nom = "Revenu Québec",
                            role = "Admin"
                        }
                    });
                }

                // Vérification des contribuables normaux
                var contribuables = await _contribuableRepository.ListAllAsync();
                var contribuable = contribuables.FirstOrDefault(c =>
                    c.Email == loginDto.Email && c.MotDePasse == loginDto.MotDePasse);

                if (contribuable == null)
                    return Unauthorized("Email ou mot de passe incorrect");

                var tokenUser = GenerateJwtToken(contribuable);

                return Ok(new
                {
                    token = tokenUser,
                    user = _mapper.Map<ContribuableDto>(contribuable)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur interne du serveur: {ex.Message}");
            }
        }

        private string GenerateJwtTokenForAdmin()
        {
            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, "0"),
        new Claim(ClaimTypes.Email, "admin"),
        new Claim(ClaimTypes.GivenName, "Administrateur"),
        new Claim(ClaimTypes.Surname, "Revenu Québec"),
        new Claim(ClaimTypes.Role, "Admin")
    };

            var key = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(_config.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(ContribuableCreateDto contribuableDto)
        {
            try
            {
                var existingContribuables = await _contribuableRepository.ListAllAsync();
                if (existingContribuables.Any(c => c.Email == contribuableDto.Email))
                    return BadRequest("Un compte avec cet email existe déjà");

                if (existingContribuables.Any(c => c.NAS == contribuableDto.NAS))
                    return BadRequest("Un compte avec ce NAS existe déjà");

                var contribuable = _mapper.Map<Contribuable>(contribuableDto);
                var result = await _contribuableRepository.AddAsync(contribuable);

                var token = GenerateJwtToken(result);

                return Ok(new
                {
                    token = token,
                    user = _mapper.Map<ContribuableDto>(result)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur interne du serveur: {ex.Message}");
            }
        }

        private string GenerateJwtToken(Contribuable contribuable)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, contribuable.Id.ToString()),
                new Claim(ClaimTypes.Email, contribuable.Email),
                new Claim(ClaimTypes.GivenName, contribuable.Prenom),
                new Claim(ClaimTypes.Surname, contribuable.Nom)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(_config.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string MotDePasse { get; set; } = string.Empty;
    }
}