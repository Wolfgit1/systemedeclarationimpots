using ApplicationFrontEnd.Core;
using System;
using System.Collections.Generic;

namespace ApplicationFrontEnd.WebAPI.Dtos
{
    public class RequestDto
    {
        public int Id { get; set; }
        public int AnneeFiscale { get; set; }
        public decimal RevenusEmploi { get; set; }
        public decimal AutresRevenus { get; set; }
        public string? AdressePostale { get; set; }
        public string? Telephone { get; set; }
        public string? Citoyennete { get; set; }
        public StatutRequest Statut { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalRevenus => RevenusEmploi + AutresRevenus;
        public List<RequestItemDto> RequestItems { get; set; } = new();
        public ContribuableDto Contribuable { get; set; } = new();
        public AvisCotisationDto? AvisCotisation { get; set; }
    }

    public class RequestCreateDto
    {
        public int ContribuableId { get; set; }
        public int AnneeFiscale { get; set; }
        public decimal RevenusEmploi { get; set; }
        public decimal AutresRevenus { get; set; }
        public string? AdressePostale { get; set; }
        public string? Telephone { get; set; }
        public string? Citoyennete { get; set; }
        public List<RequestItemCreateDto> RequestItems { get; set; } = new();
    }

    public class RequestItemDto
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public string TypeDocument { get; set; } = string.Empty;
        public string CheminFichier { get; set; } = string.Empty;
        public DateTime DateUpload { get; set; }
        public int RequestId { get; set; }
    }

    public class RequestItemCreateDto
    {
        public string Description { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public string TypeDocument { get; set; } = string.Empty;
        public string CheminFichier { get; set; } = string.Empty;
    }
}