using PortfolioApi.Models;

namespace PortfolioApi.Data;

public static class PortfolioData
{
    public static readonly Profile Profile = new(
        Name: "Branden Immerzeel",
        Title: "Senior Software Engineer",
        Summary: "Experienced Full-Stack Software Engineer with over 8 years of experience across enterprise web development and game development. Proficient in Vue.js, TypeScript, C#, and .NET. Skilled in software architecture and delivering full-stack features end-to-end, from responsive front-end interfaces to robust back-end APIs, across large, multi-repository codebases.",
        Contact: new ContactInfo(
            Email: "branden.immerzeel@gmail.com",
            Phone: "0423 889 259",
            Location: "Adelaide, SA 5163",
            LinkedIn: "https://www.linkedin.com/in/branden-immerzeel/"),
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

    public static readonly List<Recommendation> Recommendations = new()
    {
        new Recommendation(
            Id: "alexander-eagles",
            Name: "Alexander Eagles",
            Title: "Product Manager, PAVE and Productivity Tools at WiseTech Global",
            Relationship: "Senior to Branden, did not manage him directly",
            Quote: "As a product manager you want teams that can execute and do so effectively. Branden always came to work with the attitude to help me solve the teams problems. Branden would come with multiple solutions and help explore trade-offs in a way few engineers do effectively. Any team would benefit from having Branden, not just because of his technical ability - but because of his ability to take the problems and pragmatically explore solutions. If I was to assemble my dream team, Branden would be on it.",
            LinkedIn: "https://www.linkedin.com/in/alexander-eaglessydney/"),
        new Recommendation(
            Id: "ryan-smallwood-simpson",
            Name: "Ryan Smallwood-Simpson",
            Title: "Software Engineer",
            Relationship: "Reported to Branden directly",
            Quote: "Branden was my mentor when I first joined WiseTech Global. He always went the extra mile to help me find my feet at the company. He is the ideal combination of very easy to get on with and highly competent at all aspects of the software development life cycle. Finally, he was always striving to improve even further and would be a great fit to any team.",
            LinkedIn: "https://www.linkedin.com/in/ryan-smallwood-simpson-b4a076138/"),
        new Recommendation(
            Id: "juan-diego-merino-roldan",
            Name: "Juan Diego Merino Roldán",
            Title: "Software Architect at WiseTech Global",
            Relationship: "Senior to Branden, did not manage him directly",
            Quote: "I had the pleasure of working closely with Branden at Wisetech, where he consistently stood out as an exceptional Senior Software Engineer. Branden doesn't just write clean, high-quality code; he possess a rare ability to look at complex, ambiguous problems and architect and deliver elegant, scalable solutions that align perfectly with business goals. Not only a great developer but also a great person to work with. I can't recommend him enough.",
            LinkedIn: "https://www.linkedin.com/in/jdmerinor/en/"),
        new Recommendation(
            Id: "benjamin-wang",
            Name: "Benjamin Wang",
            Title: "Software Engineer at WiseTech Global",
            Relationship: "Worked with Branden on different teams",
            Quote: "I have worked with Branden in the same office for over 1 year and a half. Branden consistently brings a great attitude to work. Whether facing a tough deadline or a tricky technical problem, he approaches challenges with genuine enthusiasm to make solid contributions and deliver the results. Branden always tries to kick up a notch and strech himself. As a software engineer, Branden has always been seeking challenges beyond the scope, including proactively taking the lead in a squad, mentoring people and providing support for his team. It was a pleasure for me to have been working with Branden and with his skills I genuinely believe any team would be lucky to have Branden. I wish Branden all the best with his career.",
            LinkedIn: "https://www.linkedin.com/in/benjamin-wang-579676259/"),
        new Recommendation(
            Id: "chen-ling",
            Name: "Chen Ling",
            Title: "Software Engineer at WiseTech Global",
            Relationship: "Worked with Branden on the same team",
            Quote: "I had the pleasure of working closely with Branden during his time at WiseTech. He is a highly responsible, reliable, and intelligent professional who consistently delivers thorough, high-quality work. Branden also brings great energy to the team with his sense of humor and positive attitude. He is approachable, friendly, and always enjoyable to work with, which makes collaboration smooth and enjoyable for everyone around him. I truly enjoyed working with Branden and am confident that he will be a valuable asset and succeed in any team he joins.",
            LinkedIn: "https://www.linkedin.com/in/chen-ling-rrr/"),
        new Recommendation(
            Id: "guan-du",
            Name: "Guan Du",
            Title: "Software Engineering Team Lead",
            Relationship: "Managed Branden directly",
            Quote: "Branden is a very passionate and hard working engineer. He volunteered for many challenging projects in WiseTech and displayed great teamwork during these, onboarding and mentoring new colleagues. Branden also has great communication skills, reaching out and following up with people when necessary. I definitely saw leadership potential in Branden. I enjoyed working with Branden greatly and I think he would be a great addition to any company.",
            LinkedIn: "https://www.linkedin.com/in/guan-d-222746157/"),
        new Recommendation(
            Id: "simon-vogler",
            Name: "Simon Vogler",
            Title: "Senior Developer at Mighty Kingdom",
            Relationship: "Managed Branden directly",
            Quote: "I have worked with Branden at Mighty Kingdom for just over a year and he has implemented and maintained major features that are useful for a wide range of projects. He has great programming skills and attention to detail which has improved code quality and tools required for design and QA. He shows great problem solving skills, a desire to learn and grow, and promotes knowledge sharing with other programmers. Branden has great leadership skills, managing a squad to focus on critical build updates. He always looks for opportunities to support and encourage team members, improve project strategies, and focus on build stability.",
            LinkedIn: "https://www.linkedin.com/in/simon-vogler-81874411/"),
        new Recommendation(
            Id: "scott-cabot",
            Name: "Scott Cabot",
            Title: "Senior Software Engineer at Discovery Parks",
            Relationship: "Worked with Branden on the same team",
            Quote: "It was excellent being able to work along side Branden on our product together. He has a strong focus on systems design and consistently plans pragmatic and well designed solutions for given problems. His care for our code base, consistently looking for room for improvement made him a staple in our team. He was great at communicating feedback amongst engineers as well as to wider stakeholders. He's definitely missed!",
            LinkedIn: "https://www.linkedin.com/in/scott-cabot/"),
        new Recommendation(
            Id: "ben-calder",
            Name: "Ben Calder",
            Title: "Leader of Software Engineers in pursuit of excellence",
            Relationship: "Managed Branden directly",
            Quote: "Branden is a talented software engineer with a keen eye for detail and a solution-oriented mindset. His passion for delivering quality at speed with consistency is exemplary, and he sets himself apart with his willingness to assist those around him and share his learnings with teammates. He has an ability to think outside the box to find innovative solutions to complex problems. I believe any team would be lucky to land Branden's services, and can see him being successful in a solutions engineer or architect role moving forward.",
            LinkedIn: "https://www.linkedin.com/in/bencalder/"),
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
