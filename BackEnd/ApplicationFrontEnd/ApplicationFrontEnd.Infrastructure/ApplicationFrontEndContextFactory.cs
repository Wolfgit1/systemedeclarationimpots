using System;
using System.Collections.Generic;
using System.Text;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ApplicationFrontEnd.Infrastructure
{
    public class ApplicationFrontEndDBContextContextFactory : IDesignTimeDbContextFactory<ApplicationFrontEndDBContext>
    {
        public ApplicationFrontEndDBContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationFrontEndDBContext>();
            optionsBuilder.UseSqlServer(@"Server=.;Database=ApplicationFrontEndDB;Trusted_Connection=True;");

            return new ApplicationFrontEndDBContext(optionsBuilder.Options);
        }
    }
}
