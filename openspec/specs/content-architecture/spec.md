# Content Architecture Specification

## Purpose

Define how the portfolio sources its content.
The deployed site is a static client with no backend, so all content is served from bundled data, while an optional API integration remains available for environments that provide one.

## Requirements

### Requirement: Bundled Content As Source Of Truth

The system SHALL render all portfolio content (profile, skills, strengths, education, experience, recommendations, and projects) from data bundled with the client, with no backend required in the deployed site.

#### Scenario: Rendering without a backend

- **WHEN** the site loads in its deployed configuration, with no API base URL configured
- **THEN** every section immediately renders from its bundled fallback data
- **AND** no network request is made to a backend API

### Requirement: Optional API Override

The system SHALL fetch content from a backend API instead of bundled data only when an API base URL is configured at build time, falling back to bundled data if a request fails.

#### Scenario: API base URL configured

- **WHEN** an API base URL is provided at build time
- **THEN** each resource is fetched from that API on mount
- **AND** the bundled data is used as the initial value and as a fallback when a request fails

### Requirement: Email-Based Contact Delivery

The system SHALL deliver contact messages by opening the visitor's own mail client pre-filled, rather than posting to a backend, when no API is configured.

#### Scenario: Sending a contact message without a backend

- **WHEN** a contact message is submitted and no API base URL is configured
- **THEN** the visitor's mail client opens with the recipient, subject, and body pre-filled
