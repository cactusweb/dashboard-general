# Design

## Context

The backend `add-user-details` change (archived on the backend side) introduced `PUT /api/v2/user/data` (partial update of the four detail fields), public `GET /api/v2/countries`, the per-owner `require_user_details` flag in owner public data, the `400 user_details_required` gate on all paid order paths, and silent ignoring of body `email` on order requests. This dashboard is Angular 17 standalone components + NgRx + Material. All purchase paths funnel through `CsdOrderService.postOrderData` (`PUT /order/:id`, `POST /drop/:id/free`), with two exceptions that call `PUT /order/:id` directly: `CsdCryptoPaymentComponent` and the card-linking dialog.

Two infrastructure constraints shape the design:

- `HttpService` always prefixes `environment.apiUrl` (`…/api/v2/user`); the countries endpoint lives at `…/api/v2/countries`, one level up.
- `AuthTokenInterceptor` blocks and OAuth-redirects any request without the `auth-optional` header when no token is present; `ErrorsHandlerInterceptor` shows a snackbar for 400s and mutates `err.error.message` (capitalizes the first letter) before the error reaches component code.

## Goals / Non-Goals

**Goals:**

- One reusable details-editing surface (dialog) serving checkout gating, crypto retry, card linking, renewal retry, and profile editing.
- All email/details persistence goes through `PUT /user/data`; no order body carries `email`.
- Toggle-OFF owners keep today's email-entry UX (inline checkout field + card-link email dialog), only the save path changes.
- Client user state stays authoritative for gate checks without extra fetches.

**Non-Goals:**

- Owner-dashboard settings UI for the toggle (separate repo).
- Changing the error interceptor or its `User_details_required` toast wording (backend will fix the message).
- Displaying detail fields anywhere besides the dialog (no profile page, no nav redesign beyond the edit entry).
- Backfilling or migrating existing order emails.

## Decisions

### D1: `rootApiUrl` environment field + `HttpRequestData.apiBase` selector
Add `rootApiUrl` to both environment files (`https://[test-]api.cactusweb.io/api/v2`). Extend `HttpRequestData` with an optional base indicator (e.g. `apiBase: 'root' | 'user'`, default `'user'`) so `HttpService` picks the prefix per request.
> **Update (2026-10-18):** the deployed backend serves countries at `/api/v2/user/countries` — inside the existing user base — so `GET_COUNTRIES` does not set `apiBase: 'root'`. The `rootApiUrl`/`apiBase` capability is kept (generic, build-verified) but currently has no consumer. The endpoint is public and returns `{ countries: string[] }`; `optional: true` stays so the auth interceptor does not OAuth-redirect logged-out users before the request is sent.
*Alternative:* relative `../countries` URL — rejected: opaque, breaks if the user path segment ever changes.

### D2: One shared `UserDetailsFormComponent` dialog, two modes
Replaces `OrderEmailFormComponent`. `MatDialog` data carries `{ mode: 'full' | 'email' }`. Full mode: email, first_name, last_name, country `<select>` populated from a cached countries source. Email mode: single field — preserves the card-link UX for toggle-OFF owners. On submit → `PUT /user/data` with the shown fields → dispatch store update → close → the opener retries/proceeds via `beforeClosed`/`afterClosed` result.
*Alternative:* inline checkout form — rejected: renewal/card-link/crypto have no inline home, so a dialog is needed regardless; one component beats two divergent forms.

### D3: Countries cached in a root-provided `CountriesService`
`providedIn: 'root'` service exposing `countries$` (`shareReplay(1)`) backed by one `GET /countries` request per session. The dialog consumes it; repeated opens don't refetch.
*Alternative:* fetch per dialog open — rejected: needless duplicate requests; the list is static for a session.

### D4: Gate logic in a small `UserDetailsService`/helper, pre-gate at submit time
Completeness = all four `UserDTO` fields non-empty. `PurchaseFormComponent` combines `PurchaseService.owner$` (`require_user_details`) with `store.select(selectUser)`; on submit, if gated → open full dialog → on saved → purchase with `{}`. Toggle OFF → keep inline email field; on submit save email via `PUT /user/data` (skip when unchanged/empty-invalid is blocked client-side) then purchase with `{}`. Same helper answers the dashboard-side gate for card linking.
*Alternative:* hide/disable the pay button until complete — rejected: doc recommends gating at attempt; a disabled button with no visible reason frustrates users.

### D5: `user_details_required` detection — case-insensitive on `err.error.message`
The interceptor capitalizes the message before components see it, so the shared matcher compares `err.error.message` lower-cased. Both wordings are accepted: the backend initially returned `user_details_required` and now returns `Please fill in your profile details before purchasing`; the snackbar toast shows that human-readable message directly. Handlers live where each call is made (`CsdOrderService` callers, crypto component): open the full dialog, and on successful save retry the identical request once.
*Alternative:* `no-handle-error` header to suppress the toast — rejected: silences legitimate 400 toasts for all order calls, too blunt. *Alternative:* special-case in the interceptor — rejected by decision (leave interceptor untouched).

### D6: `CsdCryptoPaymentComponent` and card-link stop sending email; renewal body stays `{}`
Crypto body becomes `{ crypto: {...} }`. Card-link email dialog is replaced by the shared dialog (mode by gate). `renew()` already sends `{}` — only gains rejection handling. Free drops: body `{}`, never gated, no email entry added (purchase form's email field remains visible for toggle-OFF owners per decision #4; saving it for a free drop is harmless profile enrichment).

### D7: Store update after save
`PUT /user/data` returns the full updated user (same shape as `GET /@me`). Dispatch the existing `GetUserSuccess` (or an equivalent action) with the response — no refetch needed. The nav chip and future gate checks read fresh state immediately.

### D8: Profile editing entry on the nav user chip
`UserDataComponent` gains an edit affordance (icon button beside the chip) opening the shared dialog in full mode. No new route, no settings page — the app has neither, and the dialog already implements the flow.

## Risks / Trade-offs

- [Env drift: `rootApiUrl` must be kept in sync with `apiUrl` minus `/user`] → Mitigation: define both in both env files in the same task; a wrong base fails loudly (404 snackbar) on first dialog open.
- [Interceptor message mutation (`User_details_required`) could drift from the comparison] → Mitigation: single shared helper/matcher function used by all rejection handlers, case-insensitive; backend fixing the message doesn't affect the matcher.
- [Dialog retry loops if saves succeed but the order keeps failing] → Mitigation: retry once per rejection; a second rejection surfaces as the normal error path.
- [Toggle-OFF owners' users with empty profile email now produce orders with empty email (backend sources profile email)] → Accepted: mirrors the backend contract; the inline field still lets the user set one, now durably.
- [SSR: dialog and countries fetch on the server] → Mitigation: countries request is public/auth-optional and `shareReplay(1)`; dialog interactions are client-side by nature (Material dialogs don't render during SSR).

## Migration Plan

Deploy together with the backend `add-user-details` change (the backend doc already flags the pairing). No data migration; no feature flag. Rollback: revert both deploys — stored detail fields simply stop being read.

## Open Questions

- Exact copy/wording and visual treatment of the edit affordance on the nav chip (can be settled during implementation).
