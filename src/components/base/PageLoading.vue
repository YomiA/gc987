<script setup lang="ts">
import { pageLoading } from '../../pageLoading'

// Live ion-loading spinner="bubbles": nine dots around a 28px circle,
// each scaling away over 1s. Colour is the site primary, #38a8fa.
const dots = [
  { top: '0%', left: '32%', delay: '-1000ms' },
  { top: '20.5692%', left: '24.5134%', delay: '-888.889ms' },
  { top: '31.5138%', left: '5.55674%', delay: '-777.778ms' },
  { top: '27.7128%', left: '-16%', delay: '-666.667ms' },
  { top: '10.9446%', left: '-30.0702%', delay: '-555.556ms' },
  { top: '-10.9446%', left: '-30.0702%', delay: '-444.444ms' },
  { top: '-27.7128%', left: '-16%', delay: '-333.333ms' },
  { top: '-31.5138%', left: '5.55674%', delay: '-222.222ms' },
  { top: '-20.5692%', left: '24.5134%', delay: '-111.111ms' },
]
</script>

<template>
  <div v-if="pageLoading" class="page-loading" role="status" :aria-label="tr('Loading')">
    <span class="bubbles" aria-hidden="true">
      <i v-for="(dot, n) in dots" :key="n" :style="{ top: dot.top, left: dot.left, animationDelay: dot.delay }" />
    </span>
  </div>
</template>

<style scoped>
.page-loading {
  position: fixed;
  z-index: 20040;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.32);
}

.bubbles {
  position: relative;
  display: block;
  width: 28px;
  height: 28px;
  color: #38a8fa;
}

.bubbles i {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-origin: center center;
  animation: spinner-scale-out 1s linear infinite;
}

.bubbles i::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 4.375px;
  height: 4.375px;
  margin: -2.1875px 0 0 -2.1875px;
  border-radius: 50%;
  background: currentColor;
}

@keyframes spinner-scale-out {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
</style>
