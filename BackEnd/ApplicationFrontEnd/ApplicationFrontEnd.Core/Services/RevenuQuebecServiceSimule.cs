using ApplicationFrontEnd.Core.Interfaces;
using System;
using System.Threading.Tasks;

namespace ApplicationFrontEnd.Core.Services
{
    public class RevenuQuebecServiceSimule : IRevenuQuebecService
    {
        private readonly Random _random = new Random();

        public async Task<DonneesFiscalesQuebec> ObtenirDonneesFiscales(string nas, int anneeFiscale)
        {
            // Simulation de délai réseau
            await Task.Delay(800);

            // 5% de chance d'échec de connexion
            if (_random.Next(0, 100) < 5)
                throw new Exception("Service Revenu Québec temporairement indisponible");

            return new DonneesFiscalesQuebec
            {
                NAS = nas,
                AnneeFiscale = anneeFiscale,
                EstDejaDeclare = _random.Next(0, 100) < 5, // 5% de chance d'avoir déjà déclaré
                EstSuspendu = _random.Next(0, 100) < 2, // 2% de chance d'être suspendu
                DateMiseAJour = DateTime.Now
            };
        }

        public async Task<bool> VerifierContribuable(string nas, int anneeFiscale)
        {
            await Task.Delay(400);
            return !string.IsNullOrEmpty(nas) && nas.Length == 11;
        }
    }
}