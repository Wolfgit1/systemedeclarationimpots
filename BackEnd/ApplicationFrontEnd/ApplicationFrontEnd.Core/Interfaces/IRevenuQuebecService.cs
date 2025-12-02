using System;
using System.Threading.Tasks;

namespace ApplicationFrontEnd.Core.Interfaces
{
    public interface IRevenuQuebecService
    {
        Task<DonneesFiscalesQuebec> ObtenirDonneesFiscales(string nas, int anneeFiscale);
        Task<bool> VerifierContribuable(string nas, int anneeFiscale);
    }

    public class DonneesFiscalesQuebec
    {
        public string NAS { get; set; } = string.Empty;
        public int AnneeFiscale { get; set; }
        public bool EstDejaDeclare { get; set; }
        public bool EstSuspendu { get; set; }
        public DateTime DateMiseAJour { get; set; }
    }
}