# /main/inicio overlays (this pass)

Source: `https://gc987.com/main/inicio`. Destination: `/main/inicio`.

## Shell
Unchanged: `.ion-page` column, header (PWA bar + AppHeader), `.main-content` scroller, shared TabBar (`active=inicio`), SupportButton at left.

## Overlays added/fixed
1. **PwaModal** — first-paint bottom sheet. Height is content-sized so `.tip-box` (Android install steps + Aviso Amigável) is visible.
2. **ToTopButton** — `defaultTwo` 40×40 `#4DA341` circle, right 1.25rem / bottom 4.5rem. Hidden until a `.game-block` with index > 2 intersects the scroller. Click scrolls to 0 in 300ms.
3. **LoginModal** — full-column `#login-modal` (z-index 20009) from header Entrar / Registro. Same overlay switches login ↔ register. No new route.

## Interaction model
PWA modal: click (close). Login modal: click (close / mode switch / fields). To-top: scroll-driven show/hide + click-to-scroll.
