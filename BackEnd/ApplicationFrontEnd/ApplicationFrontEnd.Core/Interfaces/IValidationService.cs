using System.Threading.Tasks;
using ApplicationFrontEnd.Core;

namespace ApplicationFrontEnd.Core.Interfaces
{
    public interface IValidationService
    {
        Task<ValidationResult> ValiderDeclaration(Request declaration);
        Task<bool> VerifierAvecRevenuCanada(string nas, int anneeFiscale);
        Task<bool> VerifierAvecRevenuQuebec(string nas, int anneeFiscale);
    }
}