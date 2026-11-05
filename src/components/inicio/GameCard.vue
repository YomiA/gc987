<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '../base/SvgIcon.vue'
import type { Game } from '../../api/mock'
import { useAuthStore } from '../../stores/auth'
import { useHomeStore } from '../../stores/home'

const props = defineProps<{ game: Game; layout: 'popular' | 'grid' | 'search' }>()
const router = useRouter()
const auth = useAuthStore()
const home = useHomeStore()
const collected = computed(() => home.isCollected(props.game.id))

function open() {
  if (!auth.isLoggedIn) {
    auth.openLogin()
    return
  }
  void router.push(`/game/action/${props.game.id}`)
}

function onFavorite() {
  if (!auth.isLoggedIn) {
    auth.openLogin()
    return
  }
  void home.collect(props.game.id)
}
</script>

<template>
  <div class="game-card" :class="layout" @click="open">
    <img class="game-img" :src="game.image" :alt="tr(game.name)" loading="lazy" />
    <SvgIcon class="platform-icon" :name="`wordmark-${game.provider}`" />
    <button
      type="button"
      class="favorite"
      :class="{ on: collected }"
      :aria-label="tr('Favorito')"
      @click.stop="onFavorite"
    >
      <SvgIcon name="favorite" />
    </button>
  </div>
</template>

<style scoped>
.game-card {
  display: flex;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
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

.game-card.search {
  width: 100%;
}

.game-img {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  pointer-events: none;
  -webkit-user-drag: none;
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
  display: flex;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 4;
  padding: 0;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0);
  background: none;
  border: 0;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.4) 0 0.125rem 0.3125rem 0;
}

.favorite :deep(.svg-icon) {
  width: 100%;
  height: 100%;
}

.favorite.on {
  color: #ffc84c;
}

.popular .favorite,
.search .favorite {
  width: 1.125rem;
  height: 1.125rem;
}

.grid .favorite {
  width: 0.875rem;
  height: 0.875rem;
}
</style>
