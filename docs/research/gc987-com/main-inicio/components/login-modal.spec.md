# LoginModal (homepage auth overlay) Specification

## Overview
- **Target file:** `src/components/inicio/LoginModal.vue`
- **Source:** `https://gc987.com/main/inicio` overlay `#login-modal` after header **Entrar** / **Registro**
- **Local route:** `/main/inicio` (no new router path)
- **Interaction model:** click. Not scroll-driven. Not time-driven.
- **Viewport:** 390×844×3, `1rem = 16px`

Header **Entrar** opens login mode. Header **Registro** and in-sheet **Registro** open register mode of the **same** `ion-modal` (`id="login-modal"`). URL stays `/main/inicio`.

## DOM Structure

`ion-modal#login-modal.show-modal` 390×844, `position: absolute`, `z-index: 20009`, host `background: rgba(0, 0, 0, 0.6)`. Backdrop opacity is `0` — the dim is the host.

Enter/leave is a **bottom sheet**: `.modal-wrapper` slides with `280ms cubic-bezier(0.36, 0.66, 0.04, 1)`. Clone translates chrome+sheet from `translate3d(0, 100%, 0)` → `0` so the rounded panel rises from the bottom. `::part(content)` has `backdrop-filter: blur(4.45px)` — frost shows through the transparent 6.06rem chrome (logo + close), not through the opaque sheet.

```
.ion-page
  .warpper  width 100%; height 100%
    .header  height 6.06rem; padding 0 1rem
      .header-content  flex; space-between; padding-top 0.75rem
        ion-img.logo  max-width 7.5rem; height 1.75rem
        span.btn-close  1.875rem circle
    .content  height calc(100% - 6.06rem); padding 0 1rem;
              radius 1.25rem 1.25rem 0 0; flex column
      .header  (login / register padding differs)
        p.title
        hint + switch link
      .form-wrapper  flex 1; overflow auto; padding-top 0.5rem
        form
          .item-height × N
          .remember-account  (login only)
          .btn-login / .register-btn-warpper
```

Turnstile / captcha nodes exist at height `0`. Do not clone.

Country prefix **+55** / `fi-br` is **not** a picker — click does not open another overlay.

**Esqueceu a senha?** click in this session did not change the modal or URL. Wrapper CSS has `.forget-title` / `.forget-tips` but the flow is out of this clone.

## Copy (element.textContent, do not translate)

| Slot | Text |
| --- | --- |
| Login title | `Faça login na sua conta` |
| Login hint | `Não tem uma conta?` |
| Login switch | `Registro` |
| Login submit | `Entrar` |
| Register title | `Crie uma conta de jogo` |
| Register hint | `já tem uma conta?` |
| Register switch | `Entrar` |
| Register submit | `Registro` |
| Phone placeholder | `Telefone` |
| Password placeholder | `Senha` |
| Confirm placeholder | `Confirmar senha` |
| Dial | `+55` |
| Remember | `Lembrar Senha` |
| Forgot | `Esqueceu a senha?` |
| Phone error | `Número de telefone inválido` |
| Password error | `6-16 caracteres` |

## Computed Styles (getComputedStyle @ 390)

### Host
- 390×844, flex, `z-index: 20009`
- background `rgba(0, 0, 0, 0.6)`

### `.header` (chrome above the sheet)
- height `6.06rem` (96.96px)
- padding `0 1rem`
- background none — homepage shows through the dim
- `.header-content`: flex, space-between, `padding-top: 0.75rem`
- `.logo`: max-width `7.5rem`, height `1.75rem` (measured 120×28)
- `.btn-close`: 30×30 (`1.875rem`), `border-radius: 50%`, `background: rgba(255, 255, 255, 0.2)`, flex center
- close icon: 12×12, `currentColor` white, two 2px round strokes

### `.content` sheet
- width 390, height `calc(100% - 6.06rem)` (747.03px)
- padding `0 1rem`
- background `rgb(16, 22, 41)` → `--color-bg-400` / `--game-card-bg`
- `border-radius: 1.25rem 1.25rem 0 0` (20px)
- `box-shadow: rgb(17, 111, 205) 0px 2px 0px 0px inset` → `--more-link`
- `filter: drop-shadow(rgba(3, 177, 58, 0.44) 0px -14px 60px)`
- overflow hidden, flex column

### Login `.content > .header`
- padding `2.8rem 0 2.37rem` (44.8px / 37.92px)
- height ~142.71px

### Register `.content > .header`
- padding `1.0625rem 0 0.9375rem` (17px / 15px)
- height 92px

### `.title`
- rem: `font-size: 1.875rem; line-height: 1.2; font-weight: 700`
- computed: 30px / 36px / 700, color `rgb(255, 255, 255)` → `--color-text-100`

### Hint (`.register-hint` / `.login-hint`)
- rem: `font-size: 0.875rem; padding-right: 0.75rem; font-weight: 400`
- color `rgba(255, 255, 255, 0.4)` → `--color-text-40` on live `ion-app`

### Switch (`.register-text` / `.login-text`)
- rem: `0.875rem` / 700
- color `rgb(251, 165, 49)` → `--color-currency` / live `--accent-color-yellow`

### `.form-wrapper`
- flex `1 1 auto`, column, `padding-top: 0.5rem`, scrollbar hidden

### `.item-height`
- rem: `height: 4.375rem` (70px) even when the error line is shown

### Input row (`.input-wrapper`)
- height `--v590f90e0: 2.872rem` (45.95px)
- background `rgb(26, 29, 34)`
- border `0.666667px solid rgb(26, 35, 62)` — stylesheet `1px solid var(--color-line)` `#1a233e` → `--divider`
- radius `4px` (`0.25rem`)
- padding-left `0.75rem`
- placeholder `14px` `rgba(255, 255, 255, 0.4)`
- value `14px` / 400 white

### Phone prefix
- flag circle 20×20 (`1.25rem`), `border-radius: 50%`, live `url(/assets/br-r2-Yf30zEjB.svg)` — clone uses existing `flag-br` cropped to a circle
- flag wrapper `margin-right: 0.25rem` (`mr-1`)
- `+55`: 14px white, `padding-right: 0.625rem` (`pr-2.5`), `margin-right: 0.375rem` (`mr-1.5`)
- `border-right: 2px solid rgba(255, 255, 255, 0.2)`

### Password leading icon
- 24×24, `currentColor` white — same glyph as `security-key`

### Clear
- 30×30, color `rgb(153, 153, 153)`, icon 18×18
- `visibility: hidden` when empty; `visible` when the field has a value
- aria-label `reset`

### Eye
- slot end: `margin-left: 1rem`, inner `padding-right: 0.8125rem`
- icon 16×16, SVG group `opacity: 0.4` — reuse `security-eye-hide` / `security-eye-show`

### Valid / invalid (while typing, not on empty)
- Empty field: default border, **error `display: none`**. Blur on empty does **not** show the hint (`ion-touched` without `ion-invalid`).
- First typed character starts validation. Phone `1`–`10` digits → `Número de telefone inválido` + red border. Password length `1`–`5` → `6-16 caracteres`.
- valid border `1px solid rgb(39, 212, 139)` (`#27D48B`) once the value is complete
- invalid border `1px solid rgb(230, 64, 33)` (`#E64021`)
- error: display block, `12px/16.8px` (`0.75rem` / 1.4), `rgb(197, 0, 15)` → `--ion-color-danger`
- error padding-left `0.375rem`; warning glyph 16×16 at `left: -0.75rem` — reuse `security-warning`
- phone min/max 11; password min 6 max 16

### `.remember-account` (login only)
- flex, align center, `margin-bottom: 1.875rem`, host font `0.625rem`
- checkbox 16×16, radius 4px, default **checked**
- `.checkbox-icon` **padding 2px**, `overflow: hidden`, `box-sizing: border-box` — the mark lives in the 12×12 content box (path bbox ~10.5×7.3)
- checked fill `linear-gradient(0deg, rgb(1, 103, 202) 0%, rgb(56, 168, 250) 100%)` → `--color-checkbox-bg`
- check mark: SVG path `M1.73,12.91 8.1,19.28 22.79,4.59`, stroke white, `stroke-width: 4` (viewBox 24), `stroke-linecap: butt`
- `.text-warpper`: flex, space-between, flex 1, padding `0 0.25rem`, `12px/1.625rem`, color `rgba(255, 255, 255, 0.4)`

### Submit
- height `2.875rem` (46px), width 100%, radius `0.25rem`, font `14px/700`
- `.btn-login` `margin-bottom: 1rem`
- form `padding-bottom: 0.9375rem`
- **disabled:** native fill `linear-gradient(0deg, rgb(11, 56, 104) -13.77%, rgb(27, 76, 118) 102.34%)`, color `rgba(255, 255, 255, 0.4)`, **ion-button host `opacity: 0.5`** (without this the gradient reads too light on the sheet)
- **enabled** (phone 11 digits + password 6–16): background `rgb(17, 111, 205)` → `--more-link` / live `--theme-color-800`, color `#fff`
- Register uses the same button; label `Registro`

## States & Behaviors
- Click **X** dismisses. Backdrop opacity 0; do not treat the dim as a click-to-dismiss control (chrome sits in that band).
- Click **Registro** / **Entrar** inside the sheet toggles mode. Click-driven, not tabs-as-scroll.
- Remember defaults on. Persist phone + password locally when checked (mock only).
- Submit does **not** call gc987.com. Valid submit closes the overlay. No logged-in header in this pass.
- Hover: Ionic native shadow on `ion-button`; clone keeps static fills (mobile 390, no restyle observed).
- Prefix **+55** is static.
- **Esqueceu a senha?** is visible copy only in this clone.

## Assets
- Logo: `/images/brand/LOGO.png` (already in download-assets.mjs)
- Icons: `login-close`, `flag-br`, `security-key`, `register-clear`, `security-eye-hide`, `security-eye-show`, `security-warning`

## Responsive
- Mobile 390: full-column overlay. Tablet/desktop: same rem sheet inside `--app-max-width`.
