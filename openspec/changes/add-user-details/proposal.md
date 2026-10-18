# Proposal

## Why

The backend now stores user details (email, first name, last name, country) on the profile, lets owners make them mandatory at checkout, and sources every order email from the profile — the request-body `email` field is silently ignored. This dashboard still collects email in the order body, so checkout email capture has silently stopped working, and owners with the mandatory-details toggle have no way for their users to complete the gated purchase.

## What Changes

- Add a shared `UserDetailsFormComponent` dialog (two modes: full 4-field form with country select, email-only form) that saves via the new `PUT /user/data` partial-update endpoint and syncs the NgRx user store.
- Add the country list source: `GET /api/v2/user/countries` (public/auth-optional so logged-out users are not redirected; the deployed backend hosts it under the existing `/api/v2/user` base), cached.
- Checkout (`purchase-form`):
  - Owner toggle ON + incomplete profile → full details dialog gates the purchase, then purchase proceeds without body email.
  - Owner toggle OFF → the inline email field stays, but its value is saved via `PUT /user/data` before the purchase instead of being sent in the order body (which the backend ignores).
- Crypto payment: stop sending `email: ''`; on `400 user_details_required` open the full dialog and retry after save.
- Card linking: replace `OrderEmailFormComponent` — toggle OFF keeps the email-entry dialog UX (saving via `PUT /user/data`); toggle ON + incomplete profile uses the full dialog.
- Card renewal: on `400 user_details_required` open the full dialog and retry.
- Add profile editing: an edit action on the nav user chip opens the full details dialog (prefilled from `GET /@me`).
- Extend `UserDTO` with the four detail fields and `OwnerDTO` with `require_user_details` (already returned by the existing `GET /owner/:name` surfaces used by `PurchaseService` and `DashboardService`).
- **BREAKING (deploy pairing):** no order request sends `email` anymore; the frontend must ship together with the backend `add-user-details` change or checkout email capture has no effect.

## Capabilities

### New Capabilities
- `user-details`: the user's profile detail fields (email, first name, last name, country) — the shared editing dialog, the country list source, profile editing from the nav, and store synchronization after saves.
- `checkout-details-gate`: gating and email routing for every purchase path (first purchase, free drop, crypto, card linking, renewal) — pre-gate on the owner toggle, the `user_details_required` fallback, and routing email entry through the profile instead of the order body.

### Modified Capabilities
<!-- None: the project has no existing specs. -->

## Impact

- **Models:** `src/app/common/models/user.models.ts`, `owner.models.ts`.
- **Environments:** `src/environment/environment.ts` and `environment.prod.ts` gain `rootApiUrl`; `HttpService`/`HttpRequestData` learn to target it.
- **Requests:** `src/app/common/consts/requests.consts.ts` gains `PUT_USER_DATA` (`/data`) and `GET_COUNTRIES` (root API, `optional: true`).
- **New component:** shared `UserDetailsFormComponent` dialog (replaces `dashboard/common/components/order-email-form`).
- **Purchase flow:** `purchase/steps/purchase-form`, `common/modules/crypto-payment`.
- **Dashboard flow:** `dashboard/components/payment-card/services/payment-card.service.ts` (link + renew).
- **Nav:** `common/components/user-data` gains the profile-edit entry.
- **Store:** `common/store/user` (user shape + update after save).
- **Out of scope:** owner-dashboard settings toggle (separate repo); backend behavior; error-interceptor changes (the `User_details_required` toast wording stays — backend will fix the message).
