# /notification — "Centro de Mensagens" (Perfil → Suporte)

Extracted from `https://gc987.com/notification` in the logged-in Chrome
DevTools MCP session, emulating `390x844x3, mobile, touch`. Reached by
tapping **Suporte** on `/main/perfil` — a route push, not an overlay. Local
route: `/notification`.

No bottom tab bar on this route. Body background `#090f1f`.

## Shell

| element | geometry | style |
| --- | --- | --- |
| `ion-header` | 390×101 | transparent, `z-index: 10`, **no** elevation (unlike `/user/report`) |
| `ion-toolbar` (ios) | 390×50 | `--background: #154084`, `--min-height: 3.125rem`, `--padding-start/end: 4px`; the shadow `toolbar-background` paints `rgb(21, 64, 132)` |
| back `ion-button` | 38×22 @(6,14), glyph 16×16 @(16,17) | same custom chevron as `/user/report` (`report-back`) |
| `ion-title` (ios) | absolute over the toolbar, `padding: 0 90px` | 20px/30px, centred; text `Centro de Mensagens` |
| `div.tab-box` | 390×51 @(0,50) | `padding: 0 16px`, `background: rgb(9,15,31)` |
| `ion-content` (Suporte) | 390×743 @(0,101) | `--background: #090f1f`, `--padding-start/end: .9375rem` |
| `ion-content` (other tabs) | 390×743 @(0,101) | `--padding-start/end: 1rem` |

## Segment (3 tabs)

`ion-segment.md` 358×51 @(16,50), `justify-content: left`, hairline
`border-bottom: 1px solid rgb(26,35,62)`. Not scrollable at 390 (intrinsic
sum 304.8). Each host is `segment-button-layout-icon-top`; the native
button pads `2px 20px`. The label is a slotted `ion-button` 30×(text)
@(host+22px, 68) with `margin-top: 16px`, `margin-inline: 2px`,
`--padding-bottom: .3125rem`, 14px/500 / 22px: checked `.selected-tab`
white, idle `.base-tab` `rgb(109,120,141)`. Glyph box is at **y=72**
(not vertically centred in the 50px row). The 2px underline is
`.segment-button-indicator-background` `rgb(56,168,250)` under the
**full** host, `transform 250ms cubic-bezier(0.4, 0, 0.2, 1)`.

| tab | x | width |
| --- | --- | --- |
| Suporte | 16 | 93.53 |
| Notificação | 109.53 | 115.95 |
| Anúncio | 225.48 | 95.36 |

Default tab is **Suporte**.

## Tab 1 — "Suporte"

`src/components/perfil/notification/SupportPanel.vue`. Online chat is off
(`onlineServices: []`), so `.online-service-entry` is `display: none`.

### Board — 360×82 @(15,111)

`.board`, `display: flex`, `align-items: flex-start`, `padding: 8px`,
`margin-top: 10px`, `border-radius: 6px`, background `#101629`.

- Avatar `ion-img` 55×55 @(23,119), `object-fit: contain`, source
  `/icons/customer_service.png` → `public/images/notification/customer-service.png`.
- `.online-service` `flex: 1`, `margin-left: 8px`.
  - `.online-text` 16px/22px white: `Apoio online 24/7`.
  - `.cust-service-tips` 11px/18px `rgb(155,167,190)`, `margin: 4px 0`.

### Service rows — `.bottom .list`

Each `.service-item` is `display: flex`, `align-items: center`,
`justify-content: space-between`, `padding: 10px`, `margin-top: 10px`,
`border-radius: 5px`, background `#101629`, width 360. Icon 40×40,
`.middle` 215 with `padding: 0 12px`, `.item-nickname` 14px/18px white,
`.item-account` 12px/18px `rgb(109,120,141)`. Contato `ion-button.cust-btn`
85×30 @(280,…), 11.2px/500 white, radius 5,
`linear-gradient(0deg, #0167ca 0%, #38a8fa 100%)`.

| row | y | height | nickname / account | logo |
| --- | --- | --- | --- | --- |
| Telegram support | 203 | 74 (title wraps) | `Atendimento ao cliente Telegram 24 horas da` / `Serviço Telegram` | `…/1765292678754/TG.png` |
| Telegram channel | 287 | 60 | `GC987.COM \| Canal Oficial ®` / same | `…/1765292690192/TG.png` |
| WhatsApp channel | 357 | 60 | `GC987.COM \| Canal Oficial ®` / same | `…/1765292498428/wa2.png` |

Contato opens the public URLs from `tenant.serviceConfig.services`:
`https://t.me/Gc98_Suporte`, `https://t.me/Gc987Slots`,
`https://whatsapp.com/channel/0029Vb6R6J1C6ZvdXVCo8k3a`.

## Tabs 2–3 — "Notificação" / "Anúncio"

Same empty block the live account paints: `.empty` 358×288 @(16,117),
column, centred. `.img` 120×120 @(135,261) with `margin-top: 144px` and
`background: url(/icons/No_record.png)` (already at
`public/images/promo-page/no-record.png`). Label `Sem Registros` 16px/24px
`rgb(99,100,105)`.

## Not cloned

- Live-chat entry on the first card (hidden while `onlineServices` is empty).
- The site-wide 30×30 floating ball.
