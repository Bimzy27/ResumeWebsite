using PortfolioApi.Data;
using PortfolioApi.Models;

var builder = WebApplication.CreateBuilder(args);

const string ClientCorsPolicy = "ClientCorsPolicy";

builder.Services.AddCors(options =>
{
    options.AddPolicy(ClientCorsPolicy, policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors(ClientCorsPolicy);

var api = app.MapGroup("/api");

api.MapGet("/profile", () => PortfolioData.Profile);

api.MapGet("/experience", () => PortfolioData.Experience);

api.MapGet("/projects", () => PortfolioData.Projects);

api.MapPost("/contact", (ContactRequest request, ILogger<Program> logger) =>
{
    if (string.IsNullOrWhiteSpace(request.Name)
        || string.IsNullOrWhiteSpace(request.Email)
        || string.IsNullOrWhiteSpace(request.Message))
    {
        return Results.BadRequest(new ContactResponse(false, "Name, email, and message are all required."));
    }

    logger.LogInformation("Contact form submission from {Name} <{Email}>: {Message}",
        request.Name, request.Email, request.Message);

    return Results.Ok(new ContactResponse(true, "Thanks for reaching out — I'll get back to you soon!"));
});

app.Run("http://localhost:5080");
