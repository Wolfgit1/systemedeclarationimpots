using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ApplicationFrontEnd.Core;
using ApplicationFrontEnd.Core.Interfaces;

namespace ApplicationFrontEnd.Infrastructure
{
    public class RequestRepository : EfRepository<Request>, IRequestRepository
    {
        public RequestRepository(ApplicationFrontEndDBContext eAISolutionFrontEndContext) : base(eAISolutionFrontEndContext)
        {
        }

        public Task<Request> GetByIdWithRequestItemsAsync(int id)
        {
            return _EApplicationFrontEndDBContext.Requests
              .Include(r => r.RequestItems)
              .Include(r => r.Contribuable)
              .FirstOrDefaultAsync(r => r.Id == id);
        }

        public Task<Request> GetByIdWithAvisAsync(int id)
        {
            return _EApplicationFrontEndDBContext.Requests
                .Include(r => r.AvisCotisation)
                .Include(r => r.Contribuable)
                .Include(r => r.RequestItems)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<IEnumerable<Request>> GetByContribuableIdAsync(int contribuableId)
        {
            return await _EApplicationFrontEndDBContext.Requests
                .Include(r => r.AvisCotisation)
                .Include(r => r.RequestItems)
                .Where(r => r.Contribuable.Id == contribuableId)
                .OrderByDescending(r => r.OrderDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Request>> GetByStatutAsync(StatutRequest statut)
        {
            return await _EApplicationFrontEndDBContext.Requests
                .Include(r => r.Contribuable)
                .Include(r => r.AvisCotisation)
                .Where(r => r.Statut == statut)
                .ToListAsync();
        }
    }
}