<script setup lang="ts">
import { computed } from 'vue'
import type { TabBarItem } from '../../api/mock'

const props = defineProps<{ items: TabBarItem[]; active: string }>()
const emit = defineEmits<{ select: [key: string] }>()

/**
 * Underline geometry from the live DOM, in rem: 2.4375rem for the first of
 * five 4.875rem tabs (five tabs across the 24.375rem column).
 */
const activeIndex = computed(() => props.items.findIndex((i) => i.key === props.active))
const underlineLeft = computed(() => 2.4375 + Math.max(0, activeIndex.value) * 4.875)
</script>

<template>
  <div class="outer-wrap">
    <div class="tab-bar">
      <div class="inner-wrap">
        <div class="tab-bg">
          <div
            v-for="item in items"
            :key="item.key"
            class="tab-btn"
            @click="emit('select', item.key)"
          >
            <i
              v-if="item.icon"
              class="tab-img"
              :class="{ on: item.key === active }"
              :style="{ backgroundImage: `url(${item.icon})` }"
            />
            <span
              class="label"
              :class="{
                active: item.key === active,
                accent: item.key === 'deposito',
                'flexible-text': !item.icon,
              }"
            >
              {{ item.label }}
            </span>
          </div>
          <div class="underline" :style="{ left: `${underlineLeft}rem` }" />
        </div>
      </div>
    </div>
  </div>

  <!-- The raised hump sits at z-index 1 so the bar above it shows the icon
       through the transparent notch in bg-blue-dark.svg. -->
  <div class="deposit">
    <i class="tab-img" />
  </div>
</template>

<style scoped>
.outer-wrap {
  position: absolute;
  right: 0;
  bottom: calc(-0.0625rem + var(--sab));
  left: 0;
  z-index: 10;
  height: 3.5rem;
}

.tab-bar {
  display: flex;
  height: 3.5rem;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: rgb(153, 153, 153);
  background-image: linear-gradient(rgba(0, 0, 0, 0) 3.125rem, rgb(24, 35, 68) 3.125rem);
}

.inner-wrap {
  display: flex;
  position: relative;
  width: 24.375rem;
  height: 3.5rem;
  flex-direction: column;
}

.tab-bg {
  display: flex;
  width: 24.375rem;
  height: 3.5rem;
  background-image: url('/images/tabbar/bg-blue-dark.svg');
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
}

.tab-btn {
  display: flex;
  position: relative;
  width: 4.875rem;
  height: 3.5rem;
  padding-top: 0.25rem;
  flex-direction: column;
  align-items: center;
  flex: 1 1 0%;
  cursor: pointer;
}

.tab-img {
  width: 1.875rem;
  height: 1.875rem;
  background-size: cover;
}

.label {
  height: 0.625rem;
  font-size: 0.625rem;
  line-height: 0.625rem;
  color: var(--tab-label-off);
}

.label.flexible-text {
  margin-top: 2.3125rem;
}

.label.active {
  color: rgb(255, 255, 255);
}

.label.accent {
  color: var(--segment-indicator-line);
}

.underline {
  position: absolute;
  top: 3.0625rem;
  width: 0.5rem;
  height: 0.125rem;
  background-color: var(--segment-indicator-line);
  border-radius: 0.125rem;
  transform: translateX(-0.25rem);
  transition: left 0.3s;
}

.deposit {
  display: flex;
  position: absolute;
  bottom: calc(1.3125rem + var(--sab));
  left: 50%;
  z-index: 1;
  width: 11.25rem;
  height: 3rem;
  flex-direction: column;
  align-items: center;
  background-image: url('/images/tabbar/deposit-blue-dark.svg');
  background-size: cover;
  background-position: 50% 0%;
  background-repeat: no-repeat;
  transform: translateX(-5.625rem);
  pointer-events: none;
}

.deposit .tab-img {
  width: 3rem;
  height: 2.8125rem;
  margin-top: 0.1875rem;
  background-image: url('/images/tabbar/deposit-on.png');
  background-size: cover;
}
</style>
