using ApplicationFrontEnd.SharedKernel;
using ApplicationFrontEnd.SharedKernel.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApplicationFrontEnd.Core
{
    public class Request : BaseEntity, IAggregateRoot
    {
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public bool IsSubmitted { get; set; } = false;
        public int AnneeFiscale { get; set; }
        public StatutRequest Statut { get; set; } = StatutRequest.Brouillon;

        // Revenus
        public decimal RevenusEmploi { get; set; }
        public decimal AutresRevenus { get; set; }

        // Informations supplémentaires
        public string? AdressePostale { get; set; }
        public string? Telephone { get; set; }
        public string? Citoyennete { get; set; }

        // Pour le traitement par agent
        public int? AgentAssignéId { get; set; }
        public DateTime? DateAssignationAgent { get; set; }
        public string? RaisonRevision { get; set; }

        // Navigation properties
        public virtual List<RequestItem> RequestItems { get; set; } = new List<RequestItem>();
        public virtual Contribuable Contribuable { get; set; }
        public virtual AvisCotisation? AvisCotisation { get; set; }

        [NotMapped]
        public decimal Total => RevenusEmploi + AutresRevenus;

        [NotMapped]
        public decimal TotalRevenus => RevenusEmploi + AutresRevenus;

        public Request()
        {
            // requis par EF
        }

        public Request(Contribuable contribuable, int anneeFiscale)
        {
            Contribuable = contribuable;
            AnneeFiscale = anneeFiscale;
        }

        public void Soumettre()
        {
            IsSubmitted = true;
            Statut = StatutRequest.Soumis;
            OrderDate = DateTime.Now;
        }

        public void AddRequestItem(RequestItem requestItem)
        {
            RequestItems.Add(requestItem);
        }

        public decimal OrderTotal()
        {
            return Total;
        }

        public decimal CalculerImpôt()
        {
            var revenuImposable = TotalRevenus;

            // Barème simplifié pour Québec 2024
            if (revenuImposable <= 15700)
                return 0;

            if (revenuImposable <= 49020)
                return revenuImposable * 0.15m;

            if (revenuImposable <= 98040)
                return revenuImposable * 0.20m;

            return revenuImposable * 0.25m;
        }
    }

    public enum StatutRequest
    {
        Brouillon = 0,
        Soumis = 1,
        EnRevision = 2,
        ApprouveAutomatique = 3,
        ApprouveAgent = 4,
        Rejetee = 5
    }

    public static class StatutRequestExtensions
    {
        public static string ToFrenchString(this StatutRequest statut)
        {
            return statut switch
            {
                StatutRequest.Brouillon => "Brouillon",
                StatutRequest.Soumis => "Soumis",
                StatutRequest.EnRevision => "En révision",
                StatutRequest.ApprouveAutomatique => "Approuvé automatiquement",
                StatutRequest.ApprouveAgent => "Approuvé par agent",
                StatutRequest.Rejetee => "Rejetée",
                _ => "Inconnu"
            };
        }
    }
}
