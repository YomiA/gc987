<script setup lang="ts">
import { computed, ref } from 'vue'
import GameCard from './GameCard.vue'
import SvgIcon from '../base/SvgIcon.vue'
import type { Game, GameBlock } from '../../api/mock'

const props = defineProps<{ block: GameBlock }>()

/** Live swiper: slidesPerView 1, speed 300, effect slide, spaceBetween 1. */
const SPEED = 300

const page = ref(0)
const pageSize = computed(() => Math.max(1, props.block.games.length))
const pageCount = computed(() => Math.max(1, Math.ceil(props.block.total / pageSize.value)))
const canPrev = computed(() => page.value > 0)
const canNext = computed(() => page.value < pageCount.value - 1)

const shown = computed(() => props.block.games.length)

/** One slide per page. Extra pages cycle the downloaded thumbnails so the
 *  300ms slide still runs when later pages were never fetched. */
const pages = computed(() => {
  const src = props.block.games
  const size = pageSize.value
  return Array.from({ length: pageCount.value }, (_, i) => {
    const start = i * size
    if (start + size <= src.length) return src.slice(start, start + size)
    return Array.from({ length: size }, (__, j) => src[(start + j) % src.length]) as Game[]
  })
})

function step(delta: number) {
  const next = page.value + delta
  if (next < 0 || next > pageCount.value - 1) return
  page.value = next
}
</script>

<template>
  <div class="game-block">
    <div class="block-head">
      <div class="head-left">
        <div class="logo-container">
          <SvgIcon class="glow" name="glow" />
          <SvgIcon class="logo" :name="block.icon" />
        </div>
        <span class="title">{{ block.title }}</span>
        <span class="blue-line" />
        <span class="count">
          <span class="count-value">{{ block.total }}</span>
          <br />
          <span class="count-label">Todos</span>
        </span>
      </div>

      <div class="arrow-container">
        <button
          type="button"
          class="arrow prev"
          :class="{ disabled: !canPrev }"
          aria-label="Anterior"
          @click="step(-1)"
        >
          <SvgIcon name="arrow-left" />
        </button>
        <button
          type="button"
          class="arrow next"
          :class="{ disabled: !canNext }"
          aria-label="Próximo"
          @click="step(1)"
        >
          <SvgIcon name="arrow-right" />
        </button>
      </div>
    </div>

    <div class="game-content">
      <div
        class="track"
        :style="{
          transform: `translate3d(-${page * 100}%, 0, 0)`,
          transitionDuration: `${SPEED}ms`,
        }"
      >
        <div v-for="(games, i) in pages" :key="i" class="card-container">
          <GameCard
            v-for="(game, j) in games"
            :key="`${game.name}-${j}`"
            :game="game"
            :layout="block.layout"
          />
        </div>
      </div>
    </div>

    <div v-if="block.total > shown" class="more">
      <span class="more-label">Mostrando {{ shown }} de {{ block.total }} jogos</span>
      <button class="more-btn" type="button">
        <span class="more-btn-label">Mostrar tudo</span>
        <SvgIcon class="more-btn-icon" name="chevron-circle" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.game-block {
  margin-bottom: 0.625rem;
  padding: 0 0.5625rem;
}

.block-head {
  display: flex;
  height: 3rem;
  margin: 0 -0.5625rem 0.875rem;
  padding: 0.25rem 1rem 0 0.5625rem;
  align-items: center;
  background-image: url('/images/bg/headerTextBg.png');
  background-size: 70% 100%;
  background-repeat: no-repeat;
}

.head-left {
  display: flex;
  align-items: center;
}

.logo-container {
  position: relative;
  width: 1.875rem;
  height: 1.875rem;
  margin-right: 0.4375rem;
  color: var(--search-blue);
}

.glow {
  position: absolute;
  top: 0.5rem;
  left: 0.9375rem;
  width: 1.375rem;
  height: 1.375rem;
  font-size: 1.375rem;
  transform: translateX(-0.6875rem);
}

.logo {
  width: 1.875rem;
  height: 1.875rem;
  font-size: 1.875rem;
}

.title {
  font-size: 1rem;
  font-weight: 900;
  line-height: 1.5rem;
  color: rgb(255, 255, 255);
}

.blue-line {
  width: 0.0625rem;
  height: 1.75rem;
  margin: 0 0.5rem 0 0.625rem;
  background-color: var(--color-primary-800);
  transform: rotate(30deg);
}

.count {
  width: 2.45215rem;
  height: 1.875rem;
  padding: 0.1875rem;
  font-size: 0.75rem;
  line-height: 0.75rem;
  text-align: right;
  border-radius: 0.1875rem;
}

.count-value {
  font-weight: 900;
}

.count-label {
  opacity: 0.4;
}

.arrow-container {
  display: flex;
  width: 3.875rem;
  height: 2.03125rem;
  margin-left: auto;
  align-items: center;
  flex: 0 0 auto;
}

.arrow {
  display: flex;
  width: 1.625rem;
  height: 1.625rem;
  padding: 0.375rem;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;
  color: var(--arrow-btn-fg);
  background-color: var(--arrow-btn-bg);
  border-radius: 9999px;
}

.arrow.prev {
  margin: 0 0.3125rem;
}

.arrow.disabled {
  color: var(--arrow-btn-fg-disabled);
}

.arrow .svg-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.game-content {
  overflow: hidden;
}

.track {
  display: flex;
  transition-property: transform;
  transition-timing-function: ease;
}

.card-container {
  display: flex;
  width: 100%;
  flex: 0 0 100%;
  padding-bottom: 0.9375rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.more {
  display: flex;
  height: 3.875rem;
  padding-bottom: 1.625rem;
  flex-direction: column;
  align-items: center;
  font-size: 0.75rem;
  line-height: 1.125rem;
  text-transform: capitalize;
}

.more-label {
  height: 1.125rem;
  color: rgb(255, 255, 255);
}

.more-btn {
  display: flex;
  height: 1.125rem;
  align-items: center;
  font-size: 0.75rem;
  line-height: 1.125rem;
  text-transform: capitalize;
  color: var(--more-link);
}

.more-btn-label {
  font-weight: 600;
}

.more-btn-icon {
  width: 0.75rem;
  height: 0.75rem;
  margin-left: 0.1875rem;
  transition: transform 0.3s;
}
</style>
