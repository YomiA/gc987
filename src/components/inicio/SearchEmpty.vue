<script setup lang="ts">
/**
 * Empty catalog on Pesquisar / Recente / Favoritos.
 *
 * Live: `.empty` is `position:absolute; top:50%; transform:translateY(-50%)`
 * against ion-content (the scroller below the 112px header, 732px at 390×844),
 * not the grid. Icon 10rem white; caption ion-label.tip 14px/21px/500.
 */
import SvgIcon from '../base/SvgIcon.vue'
</script>

<template>
  <div class="empty">
    <SvgIcon class="empty-icon" name="search-no-game" />
    <span class="tip">Nenhum jogo disponível</span>
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  position: absolute;
  top: 50%;
  left: 1rem;
  width: calc(100% - 2rem);
  margin-bottom: 0.75rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translateY(-50%);
}

.empty-icon {
  width: 10rem;
  height: 10rem;
  color: var(--color-text-100);
}

.tip {
  font-family: Saira, sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  font-stretch: 100%;
  line-height: 1.3125rem;
  text-align: center;
  color: rgb(109, 120, 142);
}
</style>
