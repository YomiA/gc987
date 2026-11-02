# /game/search behaviors (390×844×3)

Source: `https://gc987.com/game/search/POPULAR`.

## Entry
Homepage `ion-button.search` (header magnifier) navigates to `/game/search/POPULAR`. Compulsory PWA sheet must be dismissed first or it eats the click.

## Back
Custom chevron (`/svg/arrow_left.svg`, same path as `report-back`). `history.back()` when the stack has a back entry; otherwise `/main/inicio`.

## Tabs (click)
| key | label | default URL |
| --- | --- | --- |
| SEARCH | Pesquisar | `/game/search/SEARCH` |
| POPULAR | Popular | `/game/search/POPULAR` |
| RECENT | Recente | `/game/search/RECENT` |
| FAVORITE | Favoritos | `/game/search/FAVORITE` |

Checked: label white / 700, 2px `#38a8fa` indicator opacity 1, full button width.
Idle: `rgb(109,120,142)` / 400, indicator opacity 0.
Icons are always the `*_on.png` set (no grayscale filter).
Tab change is **click**, not scroll. Indicator 250ms `cubic-bezier(0.4, 0, 0.2, 1)`.

Live ion-segment click from DevTools did not flip Recente while POPULAR was showing (URL stayed); navigating to `/game/search/RECENT` is the source of truth. Recente/Favoritos empty for the logged-out session. Domain alerts (`domain is unAvailable`) blocked a second extract of those empty layouts.

## Search field (input)
- Placeholder **Buscar juegos** (verbatim; Spanish on a PT-BR chrome).
- `rgb(109,120,142)` placeholder at opacity 0.6.
- Ionic left magnifier `display:none`. Custom 20×20 ionicon search at the **right**.
- Clear (`aria-label="reset"`) `display:none` until there is text; then it replaces the right magnifier.
- Typing with a non-empty value switches the route to `SEARCH` and filters catalog names (case-insensitive includes). Empty SEARCH query shows `SearchEmpty`.
- No live-session extract of suggestion chips; none rendered on Popular with an empty field.

## Scroll
Header (title + field) stays; segment + grid scroll in `ion-content`. Segment `position: relative` (not sticky).

## Out of scope
- Real `home.hot` / `game.list` APIs (mock catalog).
- Launching a live game URL (clone `/game/action/:id` is mock chrome only).
- Favoriting (star is the same visual knockout as homepage `GameCard`).
- Turnstile / PWA on this stack.
