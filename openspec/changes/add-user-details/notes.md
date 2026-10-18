# Verification Notes — add-user-details

## Environment

- Backend: `https://test-api.cactusweb.io` (deployed 2026-10-18 or earlier; confirmed live)
  - **Correction vs. original design:** countries handler lives at `GET /api/v2/user/countries`
    (user base), **not** `GET /api/v2/countries` (root base). Response shape:
    `{ "countries": string[] }`. Code and artifacts updated accordingly (design D1 note,
    proposal, task 1.2).
- Sandbox limits: no browser available (no Chrome/Chromium), no test-account credentials —
  interactive dialog/network-tab checks cannot be automated from here.

## Verified (automated, this session)

| Check | Result |
| --- | --- |
| `ng build` (production) | ✅ exit 0 (pre-existing `AboutGeneralComponent` NG8107 warning + initial-budget warning only) |
| `npm run build:ssr` (browser + server bundles) | ✅ exit 0 |
| SSR boot smoke test (`node dist/.../server/main.js`, `GET /` → 200) | ✅ full HTML rendered (nav, logo, footer); one `localStorage.removeItem` SSR error traced to this Node version's unavailable `localStorage` global in Angular's request-error path (pre-existing, environmental) |
| `GET /api/v2/user/countries` without auth | ✅ 200, `{countries: [...]}` — public as spec'd; `optional: true` kept on the request so the frontend auth interceptor doesn't OAuth-redirect logged-out users |
| `GET /api/v2/user/countries` with `auth-optional: true` header, no token | ✅ 200 — matches the frontend's request shape |
| `PUT /api/v2/user/data` without auth | ✅ 401 `{"message":"Unauthorized"}` — endpoint exists and is auth-gated as designed |
| Order bodies contain no `email` (all callers of `postOrderData` pass `{}`; crypto body is `{crypto:{...}}`) | ✅ verified by code audit + `ng build` (grep: no email key in any order body construction) |
| `openspec validate add-user-details` | ✅ valid |

## Pending — requires an authenticated browser session (dev server + test account)

Checklist per tasks 2.1–7.1:

- [ ] 2.1 Repeated dialog opens issue a single `GET /user/countries` request (network tab)
- [ ] 2.2 Save in both dialog modes; reopen shows canonicalized country (e.g. `germany` → `Germany`); backend 400 (`invalid first_name`) keeps dialog open with the error surfaced
- [ ] 3.1 Toggle-ON owner + empty profile: no order request until details saved; dismissed dialog cancels
- [ ] 3.2 Toggle-OFF: `PUT /user/data` fires before purchase (skipped when unchanged); `PUT /order/:id` and `POST /drop/:id/free` bodies contain no `email` key
- [ ] 3.3 Clear profile mid-session → purchase from toggle-ON owner → `400 user_details_required` → dialog → save → identical purchase retried once
- [ ] 4.1 Crypto on toggle-ON + incomplete profile: dialog → save → retry succeeds; body `{crypto:{...}}` without email
- [ ] 5.1 Card link toggle-OFF (email saved to profile, order body clean) and toggle-ON + incomplete (full dialog gates)
- [ ] 5.2 Renewal with incomplete profile on toggle-ON owner: dialog → save → renewal retried
- [ ] 6.1 Nav chip edit → save → state consistent; reload shows persisted values via `GET /@me`
- [ ] 7.1 Full manual matrix: toggle ON/OFF × profile complete/incomplete × {paid purchase, free drop, crypto, card link, renewal} — no path sends `email`; gated paths open dialog and recover; ungated paths unchanged
