# PwaModal (CompulsoryModal) Specification

## Overview
- **Target file:** `src/components/inicio/PwaModal.vue`
- **Source:** `https://gc987.com/main/inicio` first-paint `ion-modal.show-modal` at 390×844×3
- **Interaction model:** click-driven (close). No scroll-driven changes.

## DOM Structure
`ion-modal` 390×844, `background rgba(0,0,0,0.6)`, z-index 20008
  `.compulsory-warp` flex, align flex-end
    `.content` 390×545.5 auto height, white, radius 20px 20px 0 0
      `.header-BR` 390×135, `background-image url(/images/bg-forced-popup-BR.png)`, size 100% auto
      close row absolute 390×50, padding 10px
      body flex column, padding 4px 24px 28px, color #000
        title, desc, logo row, install+service row
        `.tip-box` 342×182.5 — Android / non-iOSH5 only. Live: `os !== "iOSH5"`.

## Computed Styles (getComputedStyle)

### `.content`
- width: 390px / 24.375rem
- height: auto (live 545.5px). Do **not** lock to 22.6875rem — that clips `.tip-box`.
- background: #fff
- border-radius: 20px 20px 0 0

### body (`.flex.flex-col.items-center.px-6.pt-1.pb-7`)
- padding: 4px 24px 28px
- height: auto (live 410.5px). Do **not** lock to 14.25rem.

### `.tip-box`
- width: 342px (full body width)
- font 12px/16px #000

### tip title
- font: 14px/20px weight 600
- margin: 10px 0
- text: `Instalação de um aplicativo Android:`

### tip steps
- each row: display flex, width 100%, 12px/16px
- index `p.mr-1.5`: margin-right 6px
1. Clique no botão acima para baixar o arquivo de instalação
2. para Android
3. Permita a instalação de aplicativos de fontes desconhecidas nas configurações do seu dispositivo.
4. Conclua a instalação.

### `.warn`
- background #F5F5F5, radius 5px, padding 5px 10px, margin-top 8px
- title row: flex, 13px/19.5px weight 600, icon 13×13 `/svg/download/tip.svg`
- body: 10px / 12.5px (`leading-tight`)
- text: `Aviso Amigável:` / `Este aplicativo passou na certificação de segurança do Google Play, portanto, fique à vontade para instalá-lo.`

### Instalar button (`.button-native`)
- 284×45 at 390; ion-button `--padding-start/end: 26px` (px, does not scale on desktop)
- host margin `4px 2px` (px, does not scale — rem would add ~2px sheet height at 1440)
- radius 999px, padding 0 26px
- background: linear-gradient(180deg, #72CB45 0%, #337611 100%)
- box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)
- start-slot icon `/svg/download/download.svg` 20×18.9, currentColor white
- icon margin `0 0.3em 0 -0.3em` (em of icon font-size 18.9px → ±5.67px at 390)
- nested label is `width 100% / height 100%` of the remaining inner; **Instalar** is centered in that remaining slot, not grouped with the icon
- label 14px/14px weight 500

## States & Behaviors
- Close: click X. N/A otherwise.
- Hover: native ion-button shadow transition; clone keeps existing static gradient.
- **iOS / iPad:** do not render `.tip-box` (Android install steps + Aviso). Sheet is only header + title + logo + Instalar.
- **Android / other:** render `.tip-box` as extracted.

## Assets
- header: `/images/bg/bg-forced-popup-BR.png` (V2.0.2 is painted in the PNG)
- icons: `pwa-download`, `pwa-service`, `pwa-tip`

## Responsive Behavior
- Mobile 390: sheet docks to the column bottom and grows with tip content.
- Tablet/desktop: same 24.375rem sheet, centered in the 390 column.
