using ApplicationFrontEnd.Core;
using ApplicationFrontEnd.Core.Interfaces;
using System;
using System.Threading.Tasks;

namespace ApplicationFrontEnd.Core.Services
{
    public class AvisCotisationService : IAvisCotisationService
    {
        public async Task<AvisCotisation> GenererAvisAutomatique(Request declaration)
        {
            var impôt = declaration.CalculerImpôt();

            return new AvisCotisation
            {
                NumeroReference = $"RQ-{DateTime.Now.Year}-{declaration.Id:D8}",
                DateGeneration = DateTime.Now,
                MontantAPayer = impôt,
                EstAutomatique = true,
                RequestId = declaration.Id,
                Request = declaration
            };
        }

        public async Task<AvisCotisation> GenererAvisPersonnalise(Request declaration, string motifsAjustement)
        {
            var impôtBase = declaration.CalculerImpôt();

            // Application de majoration pour ajustement manuel (exemple)
            var impôtAjuste = impôtBase * 1.1m;

            return new AvisCotisation
            {
                NumeroReference = $"RQ-{DateTime.Now.Year}-{declaration.Id:D8}-P",
                DateGeneration = DateTime.Now,
                MontantAPayer = impôtAjuste,
                EstAutomatique = false,
                MotifsAjustement = motifsAjustement,
                RequestId = declaration.Id,
                Request = declaration
            };
        }
    }
}