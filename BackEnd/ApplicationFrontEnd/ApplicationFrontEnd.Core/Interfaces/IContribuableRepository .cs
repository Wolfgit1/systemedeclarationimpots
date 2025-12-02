using ApplicationFrontEnd.SharedKernel.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationFrontEnd.Core.Interfaces
{
    public interface IContribuableRepository : IAsyncRepository<Contribuable>
    {
        Task<Contribuable> GetByEmailAsync(string email);
        Task<Contribuable> GetByNASAsync(string nas);
    }
}
