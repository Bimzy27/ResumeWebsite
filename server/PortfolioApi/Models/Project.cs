namespace PortfolioApi.Models;

public record ProjectLinks(string? Repo = null, string? Demo = null);

public record Project(
    string Id,
    string Title,
    string Description,
    List<string> Tags,
    ProjectLinks Links);
