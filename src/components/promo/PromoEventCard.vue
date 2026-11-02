<script setup lang="ts">
import type { PromoEvent } from '../../api/promo'

defineProps<{ event: PromoEvent }>()
const emit = defineEmits<{ select: [] }>()
</script>

<template>
  <div class="event-card" :style="{ backgroundImage: `url(${event.image})` }" @click="emit('select')">
    <!-- The live card puts an ion-item over the banner: a 7.5rem hit area that
         clips the sweep. It carries no text of its own. -->
    <div class="event-hit" :class="{ shiny: event.shiny }" />
    <p v-if="event.badge" class="red-point" />
  </div>
</template>

<style scoped>
/* 660x220 banner drawn at `100% auto`, i.e. 100%x7.5rem inside a 7.75rem box,
   so the bottom 0.25rem stays page background. */
.event-card {
  display: block;
  position: relative;
  min-height: 7.75rem;
  margin-bottom: 0.625rem;
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: 100% auto;
  border-radius: 0.625rem;
  cursor: pointer;
}

.event-hit {
  position: relative;
  z-index: 1;
  height: 7.5rem;
  overflow: hidden;
  border-radius: 0.625rem;
}

.event-hit.shiny::before {
  content: '';
  display: inline-block;
  position: absolute;
  top: -11.25rem;
  left: 0;
  z-index: 100;
  width: 1.875rem;
  height: 100%;
  background: rgb(255, 255, 255);
  animation: 6s ease-in-out 0s infinite normal none running event-shiny;
}

@keyframes event-shiny {
  0% {
    opacity: 0;
    transform: scale(0) rotate(45deg);
  }
  50% {
    opacity: 0.3;
    transform: scale(0) rotate(45deg);
  }
  81% {
    opacity: 0.6;
    transform: scale(4) rotate(45deg);
  }
  100% {
    opacity: 0;
    transform: scale(50) rotate(45deg);
  }
}

/* top-0 right-0 -translate-y-1/4 translate-x-1/4 on a 0.875rem circle */
.red-point {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100;
  width: 0.875rem;
  height: 0.875rem;
  font-size: 0.625rem;
  line-height: 0.875rem;
  text-align: center;
  color: rgb(255, 255, 255);
  background-color: #ff0000;
  border-radius: 9999px;
  transform: translate(25%, -25%);
}
</style>
