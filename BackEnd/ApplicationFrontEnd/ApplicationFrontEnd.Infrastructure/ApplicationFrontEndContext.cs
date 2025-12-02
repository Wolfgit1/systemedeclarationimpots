using Microsoft.EntityFrameworkCore;
using ApplicationFrontEnd.Core;

namespace ApplicationFrontEnd.Infrastructure
{
    public class ApplicationFrontEndDBContext : DbContext
    {
        public DbSet<Request> Requests { get; set; }
        public DbSet<RequestItem> RequestItems { get; set; }
        public DbSet<Contribuable> Contribuables { get; set; }
        public DbSet<AvisCotisation> AvisCotisations { get; set; }

        public ApplicationFrontEndDBContext(DbContextOptions<ApplicationFrontEndDBContext> options) : base(options) { }

        public ApplicationFrontEndDBContext() : base(new DbContextOptionsBuilder<ApplicationFrontEndDBContext>()
                    .UseSqlServer(@"Server=.;Database=ApplicationFrontEndDB;Trusted_Connection=True;TrustServerCertificate=true;")
                    .Options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuration pour Request - CORRECTION : Utiliser Declarations
            modelBuilder.Entity<Request>()
                .HasOne(r => r.Contribuable)
                .WithMany(c => c.Declarations)  // CHANGEMENT ICI : Requests → Declarations
                .HasForeignKey("ContribuableId");

            modelBuilder.Entity<Request>()
                .HasMany(r => r.RequestItems)
                .WithOne(ri => ri.Request)
                .HasForeignKey("RequestId");

            modelBuilder.Entity<Request>()
                .HasOne(r => r.AvisCotisation)
                .WithOne(a => a.Request)
                .HasForeignKey<AvisCotisation>("RequestId");
        }
    }
}