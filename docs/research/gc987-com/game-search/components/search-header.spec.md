# SearchHeader

Source: `.search-container > ion-header` at 390×844×3.

## Title toolbar (ios)
- Height **50px** (3.125rem), padding 0 4px, bg **rgb(16, 22, 41)** `--color-bg-400`
- Shadow `rgba(0, 0, 0, 0.1) 0px 4px 28.4px 0px`
- Back `ion-button`: 38×22 at (6, 14), margin 4px 2px, native pad `3px 4px 3px 2px`
- Icon `/svg/arrow_left.svg` = existing `report-back`, 16×16, margin 0 8px, white
- Title **Pesquisar**: absolute inset 0, pad 0 90px, 20px/30px **600**, white, pointer-events none

## Search toolbar (md)
- Height **56px**, margin-top **6px**, transparent background
- `ion-searchbar`: 8px transparent border (field 40×374 at (8, 64))
- Input: bg `--color-bg-400`, radius 5px, pad `6px 36px 6px 12px`, font **13.2px**/400, white
- Box-shadow: `--divider` 1px ring + material 2/3/1 elevation
- Placeholder **Buscar juegos**, `::placeholder` `rgb(109, 120, 142)` opacity **0.6**
- Default `.searchbar-search-icon` **display:none**
- Custom ionicon search 20×20 at (342, 74), z-index 10, white, outline 32px stroke
- Clear `aria-label=reset` display none while empty; 22px icon, right 13px of the field when shown

## Interaction
Input. Clear click. Back click. Not scroll-driven.
