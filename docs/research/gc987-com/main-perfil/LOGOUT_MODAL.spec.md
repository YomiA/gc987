# Logout modal — Sair on /main/perfil

Extracted from `https://gc987.com/main/perfil` at `390x844x3, mobile,
touch` by tapping **Sair**. Live is `ion-modal` (`show-modal`, z-index
20018) stacked over the perfil page, not a route.

## Overlay

| element | geometry | style |
| --- | --- | --- |
| `ion-modal` | 390×844 @(0,0) | flex center, `background: rgba(0,0,0,.8)` |
| `ion-backdrop` | 390×844 | opacity **0** (the dim is the modal host) |
| `.modal-wrapper` | 346×196 @(22,324) | `--width/--height: fit-content` |

Clicking the dim area dismisses, same as **Cancelar**.

## Panel — `.logout-modal`

`min-height: 10rem`, `padding: 1.0625rem 0.875rem 0.875rem`,
`border-radius: .625rem`, background `#2d323d`.

| element | geometry | style |
| --- | --- | --- |
| `.logout-modal-title` | 318×27 @(36,341) | 18px/27px/700 white, center, `margin-bottom: 1.7188rem`; copy **Sair** |
| `.logout-modal-message` | 318×21 @(36,395.5) | 14px/21px/400 `rgba(255,255,255,.4)`, center, `margin-bottom: 2.0313rem`; copy **Tem certeza de que deseja sair?** |
| `.logout-modal-btn` | 318×57 @(36,449) | flex, align center |
| **Cancelar** | 151×49 @(38,453) | min-width `9.4375rem`, height `3.0625rem`, 14px/700, radius 6px, `margin: 4px 10px 4px 2px`, gradient `linear-gradient(0deg, #0167CA 0%, #38A8FA 100%)`, md elevation shadow |
| **Sair** (in modal) | 151×49 @(201,453) | same size/type, `margin: 4px 2px`, background `#2d323d`, `border: 1px solid #0167CA`, same md shadow |

## Behaviour cloned

- Open from the list **Sair** row.
- **Cancelar** and the overlay close the modal.
- Modal **Sair** is wired to an empty `logout()` stub (live would POST
  logout and leave the session).
