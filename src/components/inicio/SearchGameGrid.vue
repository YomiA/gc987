<script setup lang="ts">
/**
 * 3-column game grid on /game/search. ion-grid.game-box padding 4px;
 * each ion-col is flex-basis 33.3333% with 4px padding. Card geometry is
 * the same style2 GameCard as the homepage popular row (119.33×161.09 at 390).
 */
import GameCard from './GameCard.vue'
import type { Game } from '../../api/mock'

defineProps<{ games: Game[] }>()
</script>

<template>
  <div class="game-box">
    <div v-for="game in games" :key="game.id" class="cell">
      <GameCard :game="game" layout="search" />
    </div>
  </div>
</template>

<style scoped>
.game-box {
  display: flex;
  /* Grow with the cards so the page scroller (header fixed, tabs+grid
     together) sizes to content. flex:1 inside the 732px scroller was
     shrinking the tab row to 6px when Popular mounted. */
  flex: 0 0 auto;
  width: 100%;
  padding: 0.25rem;
  flex-wrap: wrap;
  align-content: flex-start;
}

.cell {
  flex: 0 0 33.3333%;
  min-height: 1px;
  padding: 0.25rem;
}
</style>
