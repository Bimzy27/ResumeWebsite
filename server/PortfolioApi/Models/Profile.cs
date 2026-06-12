namespace PortfolioApi.Models;

public record ContactInfo(string Email, string Phone, string Location, string LinkedIn);

public record Strength(string Title, string Description);

public record EducationEntry(string Degree, string Institution, string Period);

public record Profile(
    string Name,
    string Title,
    string Summary,
    ContactInfo Contact,
    List<string> Skills,
    List<Strength> Strengths,
    List<EducationEntry> Education);
