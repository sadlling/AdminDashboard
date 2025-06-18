using AdminDashboard.Domain.Entities;
using AdminDashboard.Infrastructure.Context;

namespace AdminDashboard.Infrastructure.DataSeeders
{
    public static class DataSeeder
    {
        public static void Initialize(AppDbContext context)
        {
            if (!context.Users.Any())
            {
                context.Users.AddRange(
                    new User { Email = "admin@mirra.dev", PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123") }
                );
                context.SaveChanges();
            }

            if (!context.Clients.Any())
            {
                var clients = new List<Client>
            {
                new Client { Name = "Client One", Email = "client1@example.com", BalanceT = 1000m },
                new Client { Name = "Client Two", Email = "client2@example.com", BalanceT = 250.50m },
                new Client { Name = "Client Three", Email = "client3@example.com", BalanceT = 0m }
            };
                context.Clients.AddRange(clients);
                context.SaveChanges();

                if (!context.Payments.Any() && clients.Count >= 2)
                {
                    context.Payments.AddRange(
                        new Payment { ClientId = clients[0].Id, Amount = 50m, Currency = "TOKENS", Description = "Initial bonus" },
                        new Payment { ClientId = clients[0].Id, Amount = 25.99m, Currency = "TOKENS", Description = "Service fee" },
                        new Payment { ClientId = clients[1].Id, Amount = 100m, Currency = "TOKENS", Description = "Reward" },
                        new Payment { ClientId = clients[1].Id, Amount = 10.50m, Currency = "TOKENS", Description = "Purchase A" },
                        new Payment { ClientId = clients[0].Id, Amount = 70m, Currency = "TOKENS", Description = "Top-up" },
                        new Payment { ClientId = clients[0].Id, Amount = 50m, Currency = "TOKENS", Description = "Initial " },
                        new Payment { ClientId = clients[0].Id, Amount = 25.99m, Currency = "TOKENS", Description = "Free" },
                        new Payment { ClientId = clients[1].Id, Amount = 100m, Currency = "TOKENS", Description = "Reward" },
                        new Payment { ClientId = clients[1].Id, Amount = 10.50m, Currency = "TOKENS", Description = "Purchase B" },
                        new Payment { ClientId = clients[0].Id, Amount = 70m, Currency = "TOKENS", Description = "Up" }
                    );
                    context.SaveChanges();
                }
            }
            if (!context.TokenRates.Any())
            {
                context.TokenRates.Add(new TokenRate { CurrentRate = 10m, ModifiedAt = DateTime.Now });
                context.SaveChanges();
            }
        }
    }
}
