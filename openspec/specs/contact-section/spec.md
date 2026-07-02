# Contact Section Specification

## Purpose

Give visitors clear ways to reach the owner and review their credentials: direct contact details, social and professional profile links, and a downloadable resume.

## Requirements

### Requirement: Contact Details

The system SHALL display the owner's contact details (anchor `#contact`): email, phone, and location.

#### Scenario: Displaying contact details

- **WHEN** the contact section renders
- **THEN** it shows the owner's email as a `mailto:` link, the phone value as plain text, and the location

#### Scenario: Phone withheld

- **WHEN** the phone value is not a real number (e.g. "Upon request")
- **THEN** the value is shown as plain text without a dialable link

### Requirement: Profile Avatar With Fallback

The system SHALL show the owner's headshot, and SHALL fall back to the owner's initials when the headshot image is unavailable.

#### Scenario: Headshot missing

- **WHEN** the headshot image fails to load
- **THEN** an initials avatar derived from the owner's name is shown instead

### Requirement: Social And Professional Links

The system SHALL provide links to the owner's LinkedIn, GitHub, LeetCode, and YouTube profiles, each opening in a new tab.

#### Scenario: Opening a profile link

- **WHEN** the visitor activates a social link
- **THEN** the corresponding profile opens in a new browser tab with `rel="noopener"`

### Requirement: Resume Download

The system SHALL provide a link to download the owner's resume as a PDF, opening in a new tab.

#### Scenario: Downloading the resume

- **WHEN** the visitor activates the resume link
- **THEN** the resume PDF opens in a new browser tab
