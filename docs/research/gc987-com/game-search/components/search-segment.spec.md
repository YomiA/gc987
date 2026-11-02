# SearchSegment

Source: `.search-container ion-segment` (first child of `ion-content`) at 390×844×3.

## Track
- 390×53.67, padding `6px 10px 0`, flex row, `justify-content: left`
- Border-bottom `0.666667px solid rgb(26, 35, 62)` `--divider`

## Buttons (values SEARCH / POPULAR / RECENT / FAVORITE)
Host `ion-segment-button`: height 48px, min-height 48px, flex `0 1 auto`, margin-bottom -1px, `text-transform: capitalize`

Inner `ion-button.tab`: height 42px, margin 0 2px, padding `0 0 5px`, flex row, align center, justify center

| tab | host width | inner width | idle/checked |
| --- | --- | --- | --- |
| Pesquisar | 98.06 | 82.06 | idle on default |
| Popular | 84.89 | 68.89 | **checked** on `/POPULAR` |
| Recente | 86.54 | 70.54 | idle |
| Favoritos | 93.49 | 77.49 | idle |

Clone at 390 after 4px host padding: 98.95 / 84.07 / 86.54 / 93.49. Recente and Favoritos match live to the pixel; Pesquisar/Popular shift ~1px when the checked 700-weight label is on a different tab.

Idle color `rgb(109, 120, 142)` / 400; checked white / **700**. Label 14px/14px.

## Icons
Always `icons/sort/{SEARCH,POPULAR,RECENT,FAVORITE}_on.png`, 20×20, object-fit contain, **filter none** on idle and checked. Local: `/images/search/*_on.png`.

## Indicator
Per-button 2px `rgb(56, 168, 250)` `--search-blue`. Checked opacity 1, width = host (84.89 on Popular). Idle opacity 0. Transition `transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)`. Clone uses one sliding bar measured from the checked host (same as MessageSegment).
