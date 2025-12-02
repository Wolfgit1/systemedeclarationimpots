using ApplicationFrontEnd.Core;
using ApplicationFrontEnd.SharedKernel.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ApplicationFrontEnd.Core.Interfaces
{
    public interface IRequestRepository : IAsyncRepository<Request>
    {
        Task<Request> GetByIdWithRequestItemsAsync(int id);
        Task<Request> GetByIdWithAvisAsync(int id);
        Task<IEnumerable<Request>> GetByContribuableIdAsync(int contribuableId);
        Task<IEnumerable<Request>> GetByStatutAsync(StatutRequest statut);
    }
}