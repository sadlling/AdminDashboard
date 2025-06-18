using AdminDashboard.API.Shared.Extensions;
using AdminDashboard.Domain.Common;
using AdminDashboard.Infrastructure;
using AdminDashboard.Infrastructure.Context;
using AdminDashboard.Infrastructure.DataSeeders;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, configuration) =>
{
    configuration.ReadFrom.Configuration(context.Configuration);
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddInfrastructureLayer(builder.Configuration);
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection(JwtSettings.SectionName));

builder.Services.AddApiAuthentication(builder.Configuration);
builder.Services.AddGlobalExceptionHandler();
builder.Services.AddApiCorsPolicy();
builder.Services.AddMapper();
builder.Services.AddMediatr();
builder.Services.AddValidators();

builder.Services.AddHttpContextAccessor();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        dbContext.Database.Migrate();
        DataSeeder.Initialize(dbContext); 
    }
}

app.UseSerilogRequestLogging();

app.UseHttpsRedirection();
app.UseCors();

app.UseExceptionHandler();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
