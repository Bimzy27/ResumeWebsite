namespace PortfolioApi.Models;

public record ExperienceEntry(
    string Id,
    string Company,
    string Role,
    string Period,
    List<string> Highlights);
