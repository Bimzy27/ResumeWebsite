# Hero Section Specification

## Purpose

Introduce the portfolio owner at the top of the page with a headline, professional summary, primary calls to action, and social proof in the form of peer recommendations.

## Requirements

### Requirement: Hero Introduction

The system SHALL present a hero section (anchor `#top`) that displays the owner's name, an eyebrow role label, and a professional summary.

#### Scenario: Rendering the hero

- **WHEN** the page loads
- **THEN** the hero shows the eyebrow "Senior Software Engineer", the name "Branden Immerzeel" as a highlighted headline, and the summary text

### Requirement: Hero Calls To Action

The system SHALL provide two primary actions in the hero that link to the experience and contact sections.

#### Scenario: Following a hero action

- **WHEN** the visitor activates "View my experience" or "Get in touch"
- **THEN** the page navigates to `#experience` or `#contact` respectively

### Requirement: Recommendations Carousel

The system SHALL display peer recommendations in a carousel, one at a time, each showing the recommender's name, title, relationship to the owner, and quote, with controls to move between recommendations.

#### Scenario: Viewing a recommendation

- **WHEN** the recommendations carousel renders
- **THEN** it shows a single recommendation with the recommender's name, title, relationship, and quote

#### Scenario: Advancing to the next recommendation

- **WHEN** the visitor activates the next control (or selects a specific recommendation dot)
- **THEN** the displayed recommendation changes to the selected one
