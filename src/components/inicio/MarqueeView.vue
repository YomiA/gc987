<script setup lang="ts">
import SvgIcon from '../base/SvgIcon.vue'

defineProps<{ notices: string[] }>()
</script>

<template>
  <div class="marquee-bar">
    <SvgIcon class="megaphone" name="megaphone" />
    <div class="marquee">
      <div class="marquee__content">
        <label class="marquee__item">{{ (notices).map((item) => tr(item)).join('\n') }}</label>
      </div>
    </div>
    <div class="badge">
      <SvgIcon class="badge-icon" name="notice" />
    </div>
  </div>
</template>

<style scoped>
.marquee-bar {
  display: flex;
  position: relative;
  width: 22.5rem;
  height: 1.5rem;
  margin: 0.75rem 0.9375rem;
  align-items: center;
  background-color: var(--game-card-bg);
  border-radius: 0.25rem;
}

.megaphone {
  z-index: 4;
  width: 1.062988rem;
  height: 1.25rem;
  padding-right: 0.3rem;
  padding-left: 0.5rem;
  box-sizing: content-box;
  font-size: 1.25rem;
  color: rgb(190, 190, 190);
}

.marquee {
  z-index: 0;
  width: 19.137188rem;
  height: 0.90625rem;
  margin: 0.25rem 0;
  overflow: hidden;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--text-muted);
}

.marquee__content {
  display: flex;
  width: 105.918125rem;
  height: 0.90625rem;
  animation: marquee-scroll 52.6s linear infinite;
}

.marquee__item {
  width: 81.543125rem;
  height: 0.90625rem;
  margin-right: 24.375rem;
  line-height: normal;
  white-space: nowrap;
}

/* Travels from just past the right edge of the 306.195px window to fully
   past the left edge of the 1304.69px text run. */
@keyframes marquee-scroll {
  from {
    transform: translateX(19.137188rem);
  }
  to {
    transform: translateX(-81.543125rem);
  }
}

.badge {
  position: relative;
  z-index: 4;
  width: 1.5rem;
  height: 1.5rem;
  padding-right: 0.25rem;
}

.badge-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.075rem;
  font-size: 1.25rem;
  color: var(--search-blue);
}
</style>
