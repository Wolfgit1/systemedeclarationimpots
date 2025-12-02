using ApplicationFrontEnd.Core.Interfaces;
using System;
using System.Threading.Tasks;

namespace ApplicationFrontEnd.Core.Services
{
    public class RevenuCanadaServiceSimule : IRevenuCanadaService
    {
        private readonly Random _random = new Random();

        public async Task<DonneesFiscalesCanada> ObtenirDonneesFiscales(string nas, int anneeFiscale)
        {
            // Simulation de délai réseau
            await Task.Delay(1000);

            // 10% de chance d'échec de connexion (simulation)
            if (_random.Next(0, 100) < 10)
                throw new Exception("Service Revenu Canada temporairement indisponible");

            return new DonneesFiscalesCanada
            {
                NAS = nas,
                AnneeFiscale = anneeFiscale,
                RevenusDeclares = _random.Next(20000, 35000), // Simulation de données
                Nom = "Tremblay", // Données fixes pour la simulation
                Prenom = "Jean",
                DateMiseAJour = DateTime.Now
            };
        }

        public async Task<bool> VerifierContribuable(string nas, int anneeFiscale)
        {
            await Task.Delay(500);
            return !string.IsNullOrEmpty(nas) && nas.Length == 11;
        }
    }
}