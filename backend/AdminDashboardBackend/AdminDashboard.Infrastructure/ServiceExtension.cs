using AdminDashboard.Domain.Common;
using AdminDashboard.Domain.Interfaces.Services;
using AdminDashboard.Infrastructure.Context;
using AdminDashboard.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AdminDashboard.Infrastructure
{
    public static class ServiceExtensions
    {
        public static void AddInfrastructureLayer(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlite(configuration.GetConnectionString("DefaultConnection"));
            });

            SQLitePCL.Batteries_V2.Init();

            services.AddSingleton<ITokenService, TokenService>();
             
        }
    }
}
