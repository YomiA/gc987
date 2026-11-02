# /game/action/:id — game launch chrome

Extracted from `https://gc987.com/game/action/0` at `390x844x3, mobile,
touch`. Live `enterGame` pushes `/game/action/${gameId}`. Dummy id `0`
keeps the launch chrome without a playable iframe (no `gameUrl`).

Submit/launch is mock — the clone never fetches a live game URL and must
not post to gc987.com.

## Shell

No header, no TabBar, no SideFab. `ion-page` `--background: #000`,
overflow hidden. Full 390×844.

## Lobby chip (`.draggable-box`)

Live default `style="position:absolute; top:40px; left:0; z-index:30"`.
Click `replace('/transition')` then home. Clone: `history.back()` when
there is a stack, else `/main/inicio`. Drag-to-move is not cloned.

| element | geometry | style |
| --- | --- | --- |
| `.draggable-box` | 54×54 @(0,40) | 3.375rem circle, `rgba(0,0,0,.6)`, border `1px solid rgba(255,255,255,.8)`, shadow `0 .03rem .06rem rgba(0,0,0,.16)`, flex column center |
| home ion-icon | 24×24 @(15,47.8) | `/svg/home.svg`, `font-size: 1.5rem`, white |
| `.label` | 32.59×14.4 @(10.7,71.8) | 12px/14.4/**500** white; copy ` Lobby ` (spaces in the live text node) |

## Loading

`#placeholder` 390×844 @(0,0), `position:absolute`, bg `#000`, flex
center, **Loading...** 24px/36 white. Shown while `c===0` (iframe has
not fired `load`). After a mock 600ms the clone hides it; the page stays
black. No third-party iframe.

## Card entry

Homepage and `/game/search` `GameCard` push `/game/action/:id`. `id` is
the thumbnail stem (`PG_FortuneTiger`).
