using System;

namespace ApplicationFrontEnd.WebAPI.Dtos
{
    public class ContribuableDto
    {
        public int Id { get; set; }
        public string NAS { get; set; } = string.Empty;
        public string Prenom { get; set; } = string.Empty;
        public string Nom { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime DateNaissance { get; set; }
        public string? Adresse { get; set; }
        public string? Telephone { get; set; }
    }

    public class ContribuableCreateDto
    {
        public string NAS { get; set; } = string.Empty;
        public string Prenom { get; set; } = string.Empty;
        public string Nom { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string MotDePasse { get; set; } = string.Empty;
        public DateTime DateNaissance { get; set; }
    }
}