# Signed-in header (gc987.com, 390x844x3)

Captured while the browser still held a live session, because `/main/entrar`
renders the Depósito page instead of the login form once a token exists. No
account values are recorded here: the balance read `0,00` and the header shows
no username, so the clone drives these numbers from its mock account.

Same `ion-toolbar` as the signed-out header (50px tall, `--background #090f1f`,
`--padding-start 4px`, `--padding-end .9375rem`, z-index 10) with the menu
button and search icon unchanged. The two `Entrar` / `Registro` buttons are
replaced by one balance block:

```
div.assets-box            237.45, 59, 105.55 x 32
  display flex; align-items center; text-align end
  padding 2px 3px 2px 8px; border 1px solid transparent; border-radius 6px
  font 400 14px/21px

  p.currency              "R$"    17.01 x 21, margin-right 4px
  p.assets-box-number     "0,00"  27.55 x 21
    both: font-weight 700; color rgb(251, 165, 49)   (= --color-currency)

  div.wallet              301, 62, 38 x 26
    padding 4px 10px; margin-left 6px; border-radius 4px
    background-image linear-gradient(rgb(19, 201, 106), rgb(29, 149, 84))
                                                      (= --btn-green)
    ion-icon              18 x 18, color #fff
      the piggy-bank glyph, saved as src/assets/icons/wallet.svg
```

The block sits in the toolbar's `primary` slot, so it lands where the signed-out
buttons were, and the search button keeps its 32x24 box at x=343.

Note, unrelated to the login work: the live logo is now a wider PNG
(`ion-img` 178.4px wide vs the 166.16px this clone measured earlier), so the
header logo differs from the original independently of the session state.
