using System;
using System.Collections.Generic;
using System.Text;
using ApplicationFrontEnd.SharedKernel.Interfaces;
using ApplicationFrontEnd.SharedKernel;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ApplicationFrontEnd.Infrastructure
{
    public class EfRepository<T> : IAsyncRepository<T> where T : BaseEntity, IAggregateRoot
    {
        protected readonly ApplicationFrontEndDBContext _EApplicationFrontEndDBContext;

        public EfRepository(ApplicationFrontEndDBContext eAISolutionFrontEndContext)
        {
            _EApplicationFrontEndDBContext = eAISolutionFrontEndContext;
        }

        public async Task<T> AddAsync(T entity)
        {
            await _EApplicationFrontEndDBContext.Set<T>().AddAsync(entity);
            await _EApplicationFrontEndDBContext.SaveChangesAsync();
            return entity;

        }

        public async Task<int> CountAsync(ISpecification<T> spec)
        {
            return await ApplySpecification(spec).CountAsync();
        }

        public async Task DeleteAsync(T entity)
        {
            _EApplicationFrontEndDBContext.Set<T>().Remove(entity);
            await _EApplicationFrontEndDBContext.SaveChangesAsync();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _EApplicationFrontEndDBContext.Set<T>().FindAsync(id);
        }

        public async Task<IReadOnlyList<T>> ListAllAsync()
        {
            return await _EApplicationFrontEndDBContext.Set<T>().ToListAsync();
        }

        public async Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec)
        {
            return await ApplySpecification(spec).ToListAsync();
        }

        public async Task UpdateAsync(T entity)
        {
            _EApplicationFrontEndDBContext.Entry(entity).State = EntityState.Modified;
            await _EApplicationFrontEndDBContext.SaveChangesAsync();
        }

        private IQueryable<T> ApplySpecification(ISpecification<T> spec)
        {
            return SpecificationEvaluator<T>.GetQuery(_EApplicationFrontEndDBContext.Set<T>().AsQueryable(), spec);
        }

    }
}

