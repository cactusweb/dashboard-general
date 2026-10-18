# Spec Delta

## Purpose

Owns the user's profile detail fields (email, first name, last name, country): the shared editing dialog used across the app, the country list source, profile editing from the navigation, and keeping the client's user state in sync after saves.

## ADDED Requirements

### Requirement: Shared details form dialog
The dashboard SHALL provide a shared dialog for editing profile details with two modes: a full mode (email, first name, last name, country) and an email-only mode. Both modes SHALL save through the profile details partial-update endpoint, sending only the fields shown in the dialog.

#### Scenario: Full mode save
- **WHEN** the user submits the full mode form with valid values
- **THEN** the dashboard sends the four fields to the profile details endpoint and closes the dialog only after a successful response

#### Scenario: Email-only mode save
- **WHEN** the user submits the email-only form with a valid email
- **THEN** the dashboard sends only the email field to the profile details endpoint

#### Scenario: Invalid input blocked before submit
- **WHEN** the user submits the form with an empty required field or a malformed email
- **THEN** the dashboard marks the invalid fields, shows inline feedback, and does not call the endpoint

#### Scenario: Backend rejects a field
- **WHEN** the endpoint responds 400 naming a field (for example `invalid country`)
- **THEN** the dialog stays open and surfaces the error to the user

### Requirement: Form prefill from profile
The details dialog SHALL prefill its fields from the user's stored profile data, and an empty profile SHALL present empty fields.

#### Scenario: Prefill with stored details
- **WHEN** the dialog opens and the profile already has detail values
- **THEN** each field shows its stored value

#### Scenario: Empty profile
- **WHEN** the dialog opens and the profile has no details
- **THEN** the fields are empty and the country selector shows a placeholder

### Requirement: Country options come from the canonical list
The country selector SHALL offer exactly the entries of the public countries endpoint and SHALL submit the exact entry the user picked. The list SHALL be fetched without requiring authentication.

#### Scenario: Dropdown population
- **WHEN** the full mode form renders
- **THEN** the country selector lists the entries returned by the countries endpoint

#### Scenario: Submission uses the picked value
- **WHEN** the user saves with a country selected
- **THEN** the submitted country value matches the picked entry verbatim

#### Scenario: Canonical redisplay after save
- **WHEN** the endpoint stores the country in canonical form (for example `germany` becomes `Germany`)
- **THEN** reopening the dialog shows the canonical value from the profile

#### Scenario: List fetch without auth
- **WHEN** the countries endpoint is requested while the user is not authenticated
- **THEN** the request proceeds without triggering an authentication redirect

### Requirement: User state sync after save
After a successful details save, the dashboard's user state SHALL reflect the saved values without requiring a page reload.

#### Scenario: Store updated after save
- **WHEN** a details save succeeds
- **THEN** subsequent reads of the user state in the same session return the saved values

### Requirement: Profile editing entry in navigation
The navigation user area SHALL offer an edit action that opens the details dialog in full mode for the signed-in user.

#### Scenario: Edit profile
- **WHEN** the signed-in user activates the edit action in the navigation
- **THEN** the full mode dialog opens prefilled from the profile

#### Scenario: Partial update preserves untouched fields
- **WHEN** the user saves the profile editor without changing some fields
- **THEN** the stored values of the untouched fields are preserved
