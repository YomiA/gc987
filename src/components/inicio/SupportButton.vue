<script setup lang="ts">
import SvgIcon from '../base/SvgIcon.vue'
</script>

<template>
  <div class="support">
    <SvgIcon class="support-icon" name="support" />
  </div>
</template>

<style scoped>
.support {
  display: flex;
  position: absolute;
  bottom: 4.25rem;
  left: 1rem;
  z-index: 50;
  width: 2.5rem;
  height: 2.5rem;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  background-image: linear-gradient(0deg, rgb(1, 103, 202), rgb(56, 168, 250));
  border-radius: 50%;
}

.support-icon {
  width: 2rem;
  height: 2rem;
  color: rgb(255, 255, 255);
}
</style>
