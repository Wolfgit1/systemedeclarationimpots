using ApplicationFrontEnd.Core;
using System.Threading.Tasks;

namespace ApplicationFrontEnd.Core.Interfaces
{
    public interface IAvisCotisationService
    {
        Task<AvisCotisation> GenererAvisAutomatique(Request declaration);
        Task<AvisCotisation> GenererAvisPersonnalise(Request declaration, string motifsAjustement);
    }
}