# /game/category behaviors

- **Back**: `history.back()`, else `/main/inicio`.
- **Search**: submit only (magnifier / Enter). Empty submit clears the filter.
  In-flight: bubbles spinner 400ms (mock). Does not change the URL.
- **Rail**: `replace` `/game/category/:gameType/:platformId`. `0` is all
  platforms. Platforms without mock games show the empty state.
- **Tabs**: local state (not in the URL). Todos = platform catalog; Popular =
  homepage Popular row filtered by platform; Recente / Favoritos = empty.
- **Card**: `/game/action/:id` (same as home / search).
- Mock only — no requests to gc987.com.
