using ApplicationFrontEnd.SharedKernel;
using ApplicationFrontEnd.SharedKernel.Interfaces;
using System;
using System.Collections.Generic;

namespace ApplicationFrontEnd.Core
{
    public class Contribuable : BaseEntity, IAggregateRoot
    {
        public string NAS { get; set; } = string.Empty;
        public string Prenom { get; set; } = string.Empty;
        public string Nom { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string MotDePasse { get; set; } = string.Empty;
        public DateTime DateNaissance { get; set; }
        public string? Adresse { get; set; }
        public string? Telephone { get; set; }

        // Propriétés de navigation
        public virtual List<Request> Declarations { get; set; } = new List<Request>();

        public Contribuable()
        {
            // exigé par EF
        }

        public Contribuable(string nas, string prenom, string nom, string email, string motDePasse, DateTime dateNaissance)
        {
            NAS = nas;
            Prenom = prenom;
            Nom = nom;
            Email = email;
            MotDePasse = motDePasse;
            DateNaissance = dateNaissance;
        }
    }
}