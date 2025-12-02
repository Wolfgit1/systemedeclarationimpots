using ApplicationFrontEnd.Core;
using ApplicationFrontEnd.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationFrontEnd.Infrastructure
{
    public class ContribuableRepository : EfRepository<Contribuable>, IContribuableRepository
    {
        public ContribuableRepository(ApplicationFrontEndDBContext context) : base(context)
        {
        }

        public Task<Contribuable> GetByEmailAsync(string email)
        {
            // CORRECTION : Utiliser la variable correcte
            return _EApplicationFrontEndDBContext.Contribuables
                .FirstOrDefaultAsync(c => c.Email == email);
        }

        public Task<Contribuable> GetByNASAsync(string nas)
        {
            // CORRECTION : Utiliser la variable correcte
            return _EApplicationFrontEndDBContext.Contribuables
                .FirstOrDefaultAsync(c => c.NAS == nas);
        }
    }
}