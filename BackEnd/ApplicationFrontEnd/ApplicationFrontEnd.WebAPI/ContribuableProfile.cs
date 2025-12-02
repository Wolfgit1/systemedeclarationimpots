using ApplicationFrontEnd.Core;
using ApplicationFrontEnd.WebAPI.Dtos;
using AutoMapper;

namespace ApplicationFrontEnd.WebAPI.Profiles
{
    public class ContribuableProfile : Profile
    {
        public ContribuableProfile()
        {
            CreateMap<Contribuable, ContribuableDto>();
            CreateMap<ContribuableCreateDto, Contribuable>();

            CreateMap<Request, RequestDto>();
            CreateMap<RequestCreateDto, Request>();

            CreateMap<RequestItem, RequestItemDto>();
            CreateMap<RequestItemCreateDto, RequestItem>();

            // CORRECTION : Ignorer la propriété Request pour éviter la référence circulaire
            CreateMap<AvisCotisation, AvisCotisationDto>()
                .ForMember(dest => dest.Request, opt => opt.Ignore());
        }
    }
}