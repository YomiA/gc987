# /main/inicio behaviors (modal + to-top, 390×844×3)

Source: `https://gc987.com/main/inicio`.

## PWA / Compulsory modal
- First paint: blocking bottom sheet (`z-index 20008`, backdrop `rgba(0,0,0,0.6)`).
- Click-driven close. No scroll-driven restyle.
- Sheet height is **content-sized**. `.tip-box` (Android install steps) renders only when `os !== "iOSH5"` — **Apple phones do not get this block**.

## Login / register overlay (`#login-modal`)
- Click-driven. Header **Entrar** → login copy; header **Registro** or in-sheet **Registro** → register copy. URL stays `/main/inicio`.
- Bottom-sheet enter/leave: 280ms `cubic-bezier(0.36, 0.66, 0.04, 1)`, chrome+sheet `translate3d(0, 100%, 0)` → `0`. Host paints `rgba(0,0,0,0.6)`; Ionic backdrop opacity is 0.
- Logo/close chrome is transparent with `backdrop-filter: blur(4.45px)` so the homepage frosts through.
- Empty inputs do not show error; the first character starts `ion-invalid` hints.
- Submit enables when phone is 11 digits and password is 6–16 (register also needs confirm 6–16). Disabled `ion-button` host opacity is `0.5`. Mock submit closes the overlay.
- **Esqueceu a senha?** did not open another view in the live session.

## To-top (`.to-top-box.defaultTwo`)
- Hidden (`display: none`) until a game-list section with **index > 2** intersects the scroller (live `watchBuoy` → `setShowBackToTop`).
- Provider tab change forces hide. Scrolling into the footer (no game block intersecting) **keeps** the last shown state.
- Click scrolls `ion-content.main-content` to 0 (300ms).
- Geometry: 40×40 circle, `right: 1.25rem`, `bottom: calc(56px + 1rem)`, `#4DA341`, label `TOP`.
