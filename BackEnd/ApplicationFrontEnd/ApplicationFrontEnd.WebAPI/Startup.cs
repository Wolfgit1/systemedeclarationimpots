using ApplicationFrontEnd.Core.Interfaces;
using ApplicationFrontEnd.Core.Services;
using ApplicationFrontEnd.Infrastructure;
using ApplicationFrontEnd.WebAPI.Profiles;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using AutoMapper;

namespace ApplicationFrontEnd.WebAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            // AutoMapper COMME VOTRE PROFESSEUR
            services.AddAutoMapper(typeof(ContribuableProfile).Assembly);

            // Repositories
            services.AddScoped<IContribuableRepository, ContribuableRepository>();
            services.AddScoped<IRequestRepository, RequestRepository>();

            // Services de validation
            services.AddScoped<IValidationService, ValidationService>();
            services.AddScoped<IRevenuCanadaService, RevenuCanadaServiceSimule>();
            services.AddScoped<IRevenuQuebecService, RevenuQuebecServiceSimule>();
            services.AddScoped<IAvisCotisationService, AvisCotisationService>();

            // JWT Authentication
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                            .GetBytes(Configuration.GetSection("AppSettings:Token").Value)),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "ApplicationFrontEnd.WebAPI", Version = "v1" });
            });

            // CORS comme votre professeur
            services.AddCors();
        }

        public void ConfigureDevelopmentServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationFrontEndDBContext>(
                options => options.UseSqlServer(@"Server=.;Database=ApplicationFrontEndDB;Trusted_Connection=True;TrustServerCertificate=true;"));

            ConfigureServices(services);
        }

        public void ConfigureProductionServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationFrontEndDBContext>(
               options => options.UseSqlServer(@"Server=.;Database=ApplicationFrontEndDB;Trusted_Connection=True;TrustServerCertificate=true;"));

            ConfigureServices(services);
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ApplicationFrontEnd.WebAPI v1"));
            }

            app.UseHttpsRedirection();
            app.UseRouting();

            // CORS comme votre professeur
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}