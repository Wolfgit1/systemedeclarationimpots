using ApplicationFrontEnd.Core;
using ApplicationFrontEnd.Core.Interfaces;
using ApplicationFrontEnd.WebAPI.Dtos;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ApplicationFrontEnd.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContribuablesController : ControllerBase
    {
        private readonly IContribuableRepository _contribuableRepository;
        private readonly IMapper _mapper;

        public ContribuablesController(IContribuableRepository contribuableRepository, IMapper mapper)
        {
            _contribuableRepository = contribuableRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ContribuableDto>>> GetContribuables()
        {
            var contribuables = await _contribuableRepository.ListAllAsync();
            return Ok(_mapper.Map<IEnumerable<ContribuableDto>>(contribuables));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ContribuableDto>> GetContribuable(int id)
        {
            var contribuable = await _contribuableRepository.GetByIdAsync(id);
            if (contribuable == null) return NotFound();
            return Ok(_mapper.Map<ContribuableDto>(contribuable));
        }

        [HttpPost]
        public async Task<ActionResult<ContribuableDto>> CreateContribuable(ContribuableCreateDto contribuableDto)
        {
            var contribuable = _mapper.Map<Contribuable>(contribuableDto);
            var result = await _contribuableRepository.AddAsync(contribuable);
            return CreatedAtAction(nameof(GetContribuable), new { id = result.Id }, _mapper.Map<ContribuableDto>(result));
        }
    }
}