# Spec Delta

## Purpose

Owns how every purchase path (first purchase, free drop, crypto payment, card linking, renewal) interacts with the owner's mandatory-details setting: pre-gating the purchase on profile completeness, handling the `user_details_required` rejection, and routing email entry through the profile instead of the order body.

## ADDED Requirements

### Requirement: Owner toggle gates the purchase
When the owner's public data indicates user details are required and any of the four profile fields is empty, the dashboard SHALL present the full details form before performing the purchase, and SHALL perform the purchase only after a successful details save.

#### Scenario: Gated first purchase
- **WHEN** the user submits the checkout of an owner requiring details and the profile is incomplete
- **THEN** the full details form opens and no order request is sent until the details are saved

#### Scenario: Complete profile skips the form
- **WHEN** the owner requires details but the profile is complete
- **THEN** the purchase proceeds directly without the details form

#### Scenario: Toggle off skips the form
- **WHEN** the owner does not require details
- **THEN** the purchase proceeds without the full details form

### Requirement: user_details_required rejection recovery
When any purchase request is rejected with a 400 response whose message identifies the user-details gate — `user_details_required` (case-insensitive) or `Please fill in your profile details before purchasing` (the backend's later wording) — the dashboard SHALL open the full details form and, after a successful details save, retry the same purchase automatically.

#### Scenario: Rejection during renewal
- **WHEN** a renewal request is rejected with `user_details_required`
- **THEN** the full details form opens, and after a successful save the renewal request is retried

#### Scenario: Rejection during crypto purchase
- **WHEN** a crypto purchase request is rejected with `user_details_required`
- **THEN** the full details form opens, and after a successful save the same crypto purchase is retried

#### Scenario: Dismissal cancels the purchase
- **WHEN** the user dismisses the details form opened by a rejection
- **THEN** the purchase is not retried and no order state changes are made by the dashboard

### Requirement: Email entry routes through the profile when details are not required
When the owner does not require details, the dashboard SHALL keep the existing email-entry surfaces (checkout inline field, card-linking dialog) but SHALL save the entered email to the profile via the details handler before the order request instead of sending it in the order body.

#### Scenario: Checkout with toggle off
- **WHEN** the user submits the checkout email field of an owner not requiring details
- **THEN** the email is saved to the profile first and the subsequent order request contains no email field

#### Scenario: Card linking with toggle off
- **WHEN** the user confirms the card-linking email dialog of an owner not requiring details
- **THEN** the email is saved to the profile and the order request contains no email field

### Requirement: Order requests carry no email
The dashboard SHALL NOT include an email field in any order request body, including crypto purchases, free drops, card linking, and renewal.

#### Scenario: Crypto purchase body
- **WHEN** the user submits a crypto payment
- **THEN** the request body contains the crypto data and no email field

#### Scenario: Free drop body
- **WHEN** the user claims a free drop
- **THEN** the claim request contains no email field

### Requirement: Card linking respects the gate
Card linking SHALL use the details dialog instead of the email-only dialog when the owner requires details and the profile is incomplete, and SHALL handle the `user_details_required` rejection like other purchase paths.

#### Scenario: Card linking with toggle on
- **WHEN** the user starts card linking for an owner requiring details and the profile is incomplete
- **THEN** the full details form opens before the order request

#### Scenario: Card linking rejection
- **WHEN** the card-linking order request is rejected with `user_details_required`
- **THEN** the full details form opens and the order request is retried after a successful save
