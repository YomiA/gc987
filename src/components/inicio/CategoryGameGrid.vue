<script setup lang="ts">
/**
 * 3-col style2 cards on /game/category. Live ion-grid pad 0 5px (305 wide
 * next to the 85px rail); ion-col.card-col flex-basis 33.3333%, pad 0 5px 10px.
 * Card 88.32×119.23 at 390 — same GameCard.search aspect as /game/search.
 */
import GameCard from './GameCard.vue'
import type { Game } from '../../api/mock'

defineProps<{ games: Game[] }>()
</script>

<template>
  <div class="game-grid">
    <div v-for="game in games" :key="game.id" class="cell">
      <GameCard :game="game" layout="search" />
    </div>
  </div>
</template>

<style scoped>
.game-grid {
  display: flex;
  width: 100%;
  padding: 0 0.3125rem;
  flex-wrap: wrap;
  align-content: flex-start;
}

.cell {
  flex: 0 0 33.3333%;
  min-height: 1px;
  padding: 0 0.3125rem 0.625rem;
}
</style>
