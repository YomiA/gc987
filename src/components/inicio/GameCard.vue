<script setup lang="ts">
import SvgIcon from '../base/SvgIcon.vue'
import type { Game } from '../../api/mock'

defineProps<{ game: Game; layout: 'popular' | 'grid' }>()
</script>

<template>
  <div class="game-card" :class="layout">
    <img class="game-img" :src="game.image" :alt="game.name" loading="lazy" />
    <SvgIcon class="platform-icon" :name="`wordmark-${game.provider}`" />
    <SvgIcon class="favorite" name="favorite" />
  </div>
</template>

<style scoped>
.game-card {
  display: flex;
  position: relative;
  overflow: hidden;
  background-color: var(--game-card-bg);
  /* The live cards use a percentage radius, which tracks the card size. */
  border-radius: 12.5% / 9.25%;
  aspect-ratio: 84 / 113.398;
}

.game-card.popular {
  width: calc(33.3333% - 0.5rem);
}

.game-card.grid {
  width: calc(25% - 0.5625rem);
}

.game-img {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
}

/* Provider wordmark, centred along the bottom edge. */
.platform-icon {
  position: absolute;
  bottom: 0.1875rem;
  left: 50%;
  z-index: 4;
  width: 1.375rem;
  height: 1.375rem;
  font-size: 1.375rem;
  color: rgb(255, 255, 255);
  transform: translateX(-0.6875rem);
}

/* `color: transparent` is deliberate: the star path is filled with
   currentColor, so it knocks a hole through the white ring behind it. */
.favorite {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 4;
  color: rgba(0, 0, 0, 0);
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.4) 0 0.125rem 0.3125rem 0;
}

.popular .favorite {
  width: 1.125rem;
  height: 1.125rem;
}

.grid .favorite {
  width: 0.875rem;
  height: 0.875rem;
}
</style>
