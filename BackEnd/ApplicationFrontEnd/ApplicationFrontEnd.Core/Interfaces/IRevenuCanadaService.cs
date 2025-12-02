using System;
using System.Threading.Tasks;

namespace ApplicationFrontEnd.Core.Interfaces
{
    public interface IRevenuCanadaService
    {
        Task<DonneesFiscalesCanada> ObtenirDonneesFiscales(string nas, int anneeFiscale);
        Task<bool> VerifierContribuable(string nas, int anneeFiscale);
    }

    public class DonneesFiscalesCanada
    {
        public string NAS { get; set; } = string.Empty;
        public int AnneeFiscale { get; set; }
        public decimal RevenusDeclares { get; set; }
        public string Nom { get; set; } = string.Empty;
        public string Prenom { get; set; } = string.Empty;
        public DateTime DateMiseAJour { get; set; }
    }
}