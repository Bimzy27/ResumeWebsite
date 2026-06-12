using PortfolioApi.Models;

namespace PortfolioApi.Data;

public static class PortfolioData
{
    public static readonly Profile Profile = new(
        Name: "Branden Immerzeel",
        Title: "Senior Software Engineer",
        Summary: "Experienced Full-Stack Software Engineer with over 7 years of experience across enterprise web development and game development. Proficient in Vue.js, TypeScript, C#, and .NET. Skilled in software architecture and delivering full-stack features end-to-end, from responsive front-end interfaces to robust back-end APIs, across large, multi-repository codebases.",
        Contact: new ContactInfo(
            Email: "branden.immerzeel@gmail.com",
            Phone: "0423 889 259",
            Location: "Huntfield Heights, SA 5163",
            LinkedIn: "https://linkedin.com"),
        Skills: new List<string>
        {
            "C#",
            ".NET",
            "Vue.js",
            "TypeScript",
            "REST APIs",
            "Software Architecture",
            "Unit & E2E Testing",
            "CI/CD",
            "AI Tooling",
            "Unity",
            "Git",
        },
        Strengths: new List<Strength>
        {
            new("Full-Stack Development",
                "Comfortable across the stack, pairing responsive Vue.js and TypeScript interfaces with robust C# and .NET back-end services and APIs."),
            new("Leadership and Team Dynamics",
                "Proven ability to lead, manage and coach team members towards project success."),
            new("End-to-End Ownership",
                "Drives features from initial technical design through to production rollout, delivering reliably under tight deadlines."),
        },
        Education: new List<EducationEntry>
        {
            new("Bachelor of Interactive Digital Media (CS Major)", "Queensland University of Technology", "2017 Cohort"),
        });

    public static readonly List<ExperienceEntry> Experience = new()
    {
        new ExperienceEntry(
            Id: "wisetech",
            Company: "WiseTech Global",
            Role: "Full-Stack Software Engineer",
            Period: "08/2024 - 06/2026",
            Highlights: new List<string>
            {
                "Architected and delivered full-stack features for a large-scale enterprise web platform, owning a complex workflow management module end-to-end across feature flags, back-end API endpoints, and multi-tab dialog interfaces, from initial technical design through to production rollout.",
                "Designed and implemented a standalone, metadata-driven security configuration for CRUD operations spanning multiple repositories, enabling teams to configure access roles directly. Recognized by leadership for end-to-end ownership under tight deadlines.",
                "Built reusable, slot-based UI components for a shared design system, including a configurable, branding-aware login layout rolled out across numerous web portals.",
                "Created and evolved an internal multi-framework test runner adopted across the organization, extending it from a single framework to several by decoupling the runner architecture from any one testing framework. Adapted this test runner for agent usage to provide a more token-efficient way to discover/run/fix related tests.",
            }),
        new ExperienceEntry(
            Id: "mighty-kingdom",
            Company: "Mighty Kingdom",
            Role: "Senior Software Engineer",
            Period: "09/2021 - 05/2024",
            Highlights: new List<string>
            {
                "Integral member of a dynamic development team renowned for crafting award-winning narrative games tailored for mobile devices.",
                "Spearheaded the creation of robust game features, elevating the overall user experience through innovative programming solutions.",
                "Took the lead in implementing comprehensive testing strategies, including rigorous device testing, unit and end-to-end tests, and integration of data validation.",
                "Employed CI/CD methodologies to streamline game production processes, ensuring efficiency and stability in releases.",
            }),
        new ExperienceEntry(
            Id: "wymac",
            Company: "Wymac Gaming Solutions",
            Role: "Senior Software Engineer",
            Period: "06/2018 - 08/2021",
            Highlights: new List<string>
            {
                "Played a pivotal role as a core game development team member, collaborating closely with designers, artists, sound engineers, and testers to deliver high-quality games for casinos, pubs, and clubs.",
                "Led the end-to-end development process, from conceptualization to release, ensuring the successful delivery of Wymac's core games.",
                "Applied a diverse skill set encompassing problem-solving, mathematical analysis, and effective stakeholder engagement to drive project success.",
            }),
        new ExperienceEntry(
            Id: "lazy-rhino",
            Company: "Lazy Rhino Studios",
            Role: "Co-Founder / Project Leader / Lead Programmer",
            Period: "2017 - 2018",
            Highlights: new List<string>
            {
                "Orchestrated the collaboration of a talented team of game developers from QUT, guiding them through the development and successful release of the strategy game 'Monsters of Mayhem'.",
                "Spearheaded the development and deployment of 'Endless Miner,' a charming game released on the Android marketplace, showcasing the company's creativity and technical prowess.",
                "Organized and executed press events and presentations targeting various game companies, promoting our products and fostering valuable industry connections.",
            }),
        new ExperienceEntry(
            Id: "code-camp",
            Company: "Code Camp & Junior Engineers",
            Role: "Programming Teacher",
            Period: "2016 - 2017",
            Highlights: new List<string>
            {
                "Engaged as a full-time educator and extracurricular instructor, imparting foundational programming concepts to classroom environments comprising approximately thirty eager young learners.",
                "Enhanced leadership, presentation, teamwork, and public speaking skills during tenure at both Code Camp and Junior Engineers.",
            }),
    };

    public static readonly List<Project> Projects = new()
    {
        new Project(
            Id: "portfolio-site",
            Title: "This Portfolio Website",
            Description: "A full-stack portfolio built with a Vue 3 + TypeScript front end and an ASP.NET Core minimal API back end, demonstrating the exact stack used day-to-day.",
            Tags: new List<string> { "Vue", "TypeScript", "C#", ".NET", "REST API" },
            Links: new ProjectLinks()),
        new Project(
            Id: "slime-slayer",
            Title: "Slime Slayer",
            Description: "A top-down shooter for mobile, built as a Test-Driven Development case study covering the full game development lifecycle from concept through to release on Google Play and the App Store.",
            Tags: new List<string> { "Unity", "C#", "TDD", "Mobile" },
            Links: new ProjectLinks()),
        new Project(
            Id: "bimzydev",
            Title: "BimzyDev YouTube Channel",
            Description: "A YouTube channel sharing game development tutorials and devlogs, showcasing techniques and progress to a community of learners and enthusiasts.",
            Tags: new List<string> { "Content Creation", "Game Development", "YouTube" },
            Links: new ProjectLinks()),
    };
}
