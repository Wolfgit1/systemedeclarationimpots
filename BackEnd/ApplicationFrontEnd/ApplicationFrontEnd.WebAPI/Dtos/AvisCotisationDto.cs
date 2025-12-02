using ApplicationFrontEnd.Core;
using System;
using System.Text.Json.Serialization;

namespace ApplicationFrontEnd.WebAPI.Dtos
{
    public class AvisCotisationDto
    {
        public int Id { get; set; }
        public string NumeroReference { get; set; } = string.Empty;
        public DateTime DateGeneration { get; set; }
        public decimal MontantAPayer { get; set; }
        public bool EstAutomatique { get; set; }
        public string? MotifsAjustement { get; set; }
        public int RequestId { get; set; }

        // Navigation property
       
        [JsonIgnore] // Ajoutez cette annotation
        public RequestDto? Request { get; set; }
    }
}