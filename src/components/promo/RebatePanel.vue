<script setup lang="ts">
import { computed } from 'vue'
import { formatAmount, formatRate, type RebateCategory, type RebateRow } from '../../api/promo'

const props = defineProps<{
  categories: RebateCategory[]
  rows: RebateRow[]
  receivable: number
  activeCategory: string
}>()
const emit = defineEmits<{ selectCategory: [key: string]; history: [] }>()

/**
 * The live rows draw their platform logo with `ion-icon`, which inlines the
 * fetched SVG so its `fill="currentColor"` picks up the white text colour.
 * Inlining the same files reproduces that; an <img> would render them black.
 */
const LOGOS = import.meta.glob('../../assets/promo/providers/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function logo(slug: string) {
  return LOGOS[`../../assets/promo/providers/${slug}.svg`] ?? ''
}

/**
 * The live payload only enables ELECTRONIC, and the other three tiles stay in
 * the DOM with `display: none`. Rendering just the enabled ones keeps the rail
 * identical without carrying dead markup.
 */
const tiles = computed(() => props.categories.filter((c) => c.enabled))
</script>

<template>
  <div class="page-scroller rebate-scroll">
    <div class="rebate-root">
      <div class="receivable">
        <div>
          <span>{{ tr('Pode ser coletado hoje：') }}</span>
          <span class="amount emphasis">{{ formatAmount(receivable) }}</span>
        </div>
      </div>

      <div class="rebate-body">
        <div class="main-left">
          <div class="cat-list">
            <button
              v-for="cat in tiles"
              :key="cat.key"
              type="button"
              class="cat-btn"
              :class="{ on: cat.key === activeCategory }"
              @click="emit('selectCategory', cat.key)"
            >
              <img class="cat-icon" :src="cat.icon" :alt="tr(cat.label)" />
              <span class="cat-label">{{ tr(cat.label) }}</span>
            </button>
          </div>

          <button type="button" class="side-btn claim">{{ tr('Receber') }}</button>
          <button type="button" class="side-btn history" @click="emit('history')">{{ tr('Histórico') }}</button>
        </div>

        <div class="main-right">
          <div v-for="row in rows" :key="row.platformId" class="rebate-item">
            <div class="main-rebate">
              <div class="top-rebate">
                <div class="top-left">
                          <div class="platform">
                            <span class="logo" :title="tr(row.name)" v-html="logo(row.slug)" />
                            <p class="dim gap">{{ tr('Aposta') }}</p>
                          </div>
                  <div class="amount">{{ formatAmount(row.bet) }}</div>
                </div>
                <div class="rebate-right">
                  <span class="dim gap">{{ tr('Taxa de reembolso') }}</span>
                  <span>{{ formatRate(row.rate) }}</span>
                </div>
              </div>

              <div class="bottom-rebate">
                <div class="bottom-left">
                  <div class="bar">
                    <div class="bar-fill" :style="{ width: `${row.progress * 100}%` }" />
                  </div>
                  <div class="bar-text">
                    Aposte {{ formatAmount(row.tierBet) }} para receber
                    <span>{{ formatRate(row.tierRate) }}</span>
                  </div>
                </div>
                <div class="rebate-right">
                  <span class="dim gap">{{ tr('Coletável') }}</span>
                  <span class="amount emphasis">{{ formatAmount(row.claimable) }}</span>
                </div>
              </div>
            </div>

            <!-- ion-item's detail arrow: ionicons chevron-forward at
                 --detail-icon-font-size 1rem, opacity 1, white. -->
            <svg class="chevron" viewBox="0 0 512 512" aria-hidden="true">
              <path
                d="M184 112l144 144-144 144"
                fill="none"
                stroke="currentColor"
                stroke-width="48"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ion-content: --padding-top 10px, --padding-start/-end 15px, --padding-bottom 0,
   --background #090f1f. */
.rebate-scroll {
  padding: 0.625rem 0.9375rem 0;
  background-color: #090f1f;
}

.rebate-root {
  position: relative;
  width: 100%;
  padding-bottom: 4.5rem;
}

/* "Pode ser coletado hoje：0,00" */
.receivable {
  display: flex;
  width: 100%;
  padding: 0.625rem 0;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  line-height: 1rem;
  color: #fff;
}

.amount {
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
}

.emphasis {
  color: #fba531;
}

.rebate-body {
  display: flex;
  width: 100%;
  margin-bottom: 3.5rem;
}

/* Both columns shrink out of a 445px basis into the 360px row, which is what
   puts the rail at 66.85px and the list at 283.15px at a 390 column. */
.main-left {
  width: 5.3125rem;
  /* The live rail keeps its content height (146px) instead of stretching to the
     list beside it. */
  align-self: flex-start;
  margin-right: 0.625rem;
  overflow-y: auto;
}

.cat-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  overflow: hidden;
  background-color: #101629;
  /* px: Ionic's ios segment radius, outside the site's rem scale. */
  border-radius: 8px;
}

.cat-btn,
.side-btn {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.625rem;
  padding: 2px 0;
  border-radius: 7px;
}

.cat-btn {
  min-height: 3.75rem;
}

/* segment-button-indicator: absolute, inset 2px on the sides, behind the label. */
.cat-btn.on::before {
  content: '';
  position: absolute;
  top: 0;
  right: 2px;
  bottom: 0;
  left: 2px;
  z-index: 0;
  background-color: rgb(25, 30, 45);
  border-radius: 7px;
}

.cat-icon {
  position: relative;
  z-index: 1;
  width: 2.25rem;
  height: 2.25rem;
}

.cat-label {
  position: relative;
  z-index: 1;
  font-size: 0.75rem;
  line-height: 1rem;
  color: #fff;
}

/* width, because a <button> would otherwise shrink to its label and the
   grey/orange block would be narrower than the rail. */
.side-btn {
  width: 100%;
  min-height: 1.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem;
  color: #fff;
}

/* Disabled state of the live "Receber" button (balance is 0). */
.claim {
  background-color: rgb(98, 98, 98);
}

.history {
  background-image: linear-gradient(rgb(255, 194, 113) 0%, rgb(242, 145, 13) 100%);
}

.main-right {
  width: 100%;
  overflow-y: auto;
}

/* ion-item.rebate: --min/height/--max-height 3.75rem, --background #101629,
   border-radius .625rem, ::part(native) padding-inline-start .4rem,
   --inner-padding-end 0 with the 1rem detail icon sitting in that gap. */
.rebate-item {
  display: flex;
  align-items: center;
  height: 3.75rem;
  margin-bottom: 0.625rem;
  padding-left: 0.4rem;
  overflow: hidden;
  font-size: 0.625rem;
  /* normal, as on the live row: every line box inside is 12px, which is what
     makes .main-rebate 40px tall and centres it in the 60px card. */
  line-height: normal;
  color: #fff;
  background-color: #101629;
  border-radius: 0.625rem;
}

.main-rebate {
  display: flex;
  flex: 1 1 0%;
  min-width: 0;
  flex-direction: column;
}

.top-rebate,
.bottom-rebate {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1px 0;
}

.top-left,
.bottom-left {
  position: relative;
  flex: 1 1 0%;
}

.top-left {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.platform {
  display: flex;
  align-items: center;
}

/* ion-icon.text-2xl: a 1em box at 24px with fill: currentcolor. */
.logo {
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  flex: 0 0 auto;
  fill: currentcolor;
}

.logo :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}

.dim {
  color: rgba(255, 255, 255, 0.4);
}

.gap {
  margin: 0 0.25rem;
}

.rebate-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 8.75rem;
  padding-right: 5px;
  text-align: right;
}

/* ion-progress-bar.h-2.5: 10px tall, 16px radius, buffer rgb(59,65,82). */
.bar {
  width: 100%;
  height: 0.625rem;
  overflow: hidden;
  background-color: rgb(59, 65, 82);
  border-radius: 16px;
}

.bar-fill {
  height: 100%;
  background-image: linear-gradient(rgb(255, 194, 113) 0%, rgb(242, 145, 13) 100%);
  border-radius: 208px;
}

.bar-text {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
  color: #fff;
}

.bar-text span {
  white-space: nowrap;
  color: #fc974c;
}

.chevron {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
  color: #fff;
}
</style>
