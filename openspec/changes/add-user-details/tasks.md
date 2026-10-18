# Tasks

## 1. Foundation: env, http base, models, request consts

- [x] 1.1 Add `rootApiUrl` to `src/environment/environment.ts` and `environment.prod.ts`, add the `apiBase` selector to `HttpRequestData`/`HttpService` prefix logic, and verify `ng build` passes
- [x] 1.2 Add `PUT_USER_DATA` (`/data`, PUT) and `GET_COUNTRIES` (user base — the deployed backend serves `/api/v2/user/countries`, `optional: true`, response `{ countries: string[] }`) to `src/app/common/consts/requests.consts.ts` and verify `ng build` passes
- [x] 1.3 Extend `UserDTO` with `email`, `first_name`, `last_name`, `country` and `OwnerDTO` with `require_user_details` (defaults tolerated when absent), and verify `ng build` passes

## 2. Countries source and shared details dialog

- [ ] 2.1 Create root-provided `CountriesService` exposing `countries$` (`shareReplay(1)`, one `GET /countries` per session) and verify via dev-server network tab that repeated dialog opens issue a single request
- [ ] 2.2 Create `UserDetailsFormComponent` (MatDialog) with `full` and `email` modes: Reactive Forms validation mirroring backend rules (email format; names Latin letters/spaces/hyphens/apostrophes, ≤64; country from list), country `<select>` fed by `CountriesService`, prefill from `store.select(selectUser)`, submit → `PUT /user/data` with shown fields → dispatch user-store update with the response → close. Verify against the test backend: save in both modes, reopen shows canonicalized country, backend 400 (`invalid first_name`) keeps the dialog open with the error surfaced
- [x] 2.3 Add the shared case-insensitive `user_details_required` matcher helper and verify `ng build` passes (consumed by groups 3–5)

## 3. Checkout purchase form

- [ ] 3.1 Gate the submit in `PurchaseFormComponent`: combine `PurchaseService.owner$` and `selectUser`; when `require_user_details` and any field empty → open the full dialog → purchase with `{}` only after a successful save; dismissed dialog cancels. Verify with a toggle-ON owner and an empty profile on the test backend: no order request until saved
- [ ] 3.2 Toggle-OFF path: keep the inline email field, on submit save it via `PUT /user/data` (skip call when unchanged) then run the purchase with `{}`; ensure `postOrderData` no longer receives the email for any purchase (paid and free drop). Verify via network tab that `PUT /order/:id` and `POST /drop/:id/free` bodies contain no `email` key
- [ ] 3.3 Handle `400 user_details_required` on the checkout purchase (fallback when state raced): open the full dialog, retry the identical purchase once after save. Verify by clearing profile fields mid-session and purchasing from a toggle-ON owner

## 4. Crypto payment

- [ ] 4.1 In `CsdCryptoPaymentComponent`: send `{ crypto: {...} }` without `email`, and on `user_details_required` open the full dialog and retry the same request once after save. Verify a crypto purchase on a toggle-ON owner with an incomplete profile: dialog → save → retry succeeds; body has no email

## 5. Card linking and renewal

- [ ] 5.1 Rework `PaymentCardService.linkCard()`: replace `OrderEmailFormComponent` with the shared dialog — full mode when the owner gate + incomplete profile applies, email mode otherwise; after a successful save send the order request with `{}`. Delete `order-email-form` once unreferenced. Verify card linking on toggle-OFF (email saved to profile, order body clean) and toggle-ON + incomplete (full dialog gates)
- [ ] 5.2 Add `user_details_required` recovery to `PaymentCardService.renew()`: open the full dialog, retry the renewal once after save. Verify renewal with an incomplete profile on a toggle-ON owner

## 6. Profile editing

- [ ] 6.1 Add the edit affordance to the nav user chip in `UserDataComponent` opening the shared dialog in full mode. Verify: edit → save → snackbar/nav state consistent, reload shows persisted values via `GET /@me`

## 7. Integration checks

- [ ] 7.1 Full manual matrix on the test backend — toggle ON/OFF × profile complete/incomplete × {paid purchase, free drop, crypto, card link, renewal}: no path sends `email` in an order body (network-tab filter), every gated path opens the dialog and recovers, every ungated path behaves as before. Record results in this change's notes
- [x] 7.2 Verify production builds pass: `ng build` and `npm run build:ssr` complete without errors
