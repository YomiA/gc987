<script setup lang="ts">
/**
 * /game/action/:id — launch chrome after a game card tap. Mock only: black
 * stage + Lobby chip, never a live game URL. See
 * docs/research/gc987-com/game-action/GAME_ACTION.spec.md.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '../components/base/SvgIcon.vue'

const router = useRouter()
const loading = ref(true)
let loadTimer = 0

function goLobby() {
  if (router.options.history.state.back) router.back()
  else void router.replace('/main/inicio')
}

onMounted(() => {
  loadTimer = window.setTimeout(() => {
    loading.value = false
  }, 600)
})

onBeforeUnmount(() => {
  window.clearTimeout(loadTimer)
})
</script>

<template>
  <div class="ion-page game-page">
    <button type="button" class="lobby" @click="goLobby">
      <SvgIcon class="home" name="game-lobby-home" />
      <p class="label"> Lobby </p>
    </button>
    <div v-if="loading" id="placeholder">Loading...</div>
  </div>
</template>

<style scoped>
.game-page {
  overflow: hidden;
  background-color: #000;
}

.lobby {
  display: flex;
  position: absolute;
  top: 40px;
  left: 0;
  z-index: 30;
  width: 3.375rem;
  height: 3.375rem;
  margin: 0;
  padding: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #fff;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.6);
  border: 0.0625rem solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  box-shadow: 0 0.03rem 0.06rem rgba(0, 0, 0, 0.16);
}

.home {
  width: 1.5rem;
  height: 1.5rem;
}

.label {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.2;
  color: #fff;
}

#placeholder {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  line-height: 2.25rem;
  color: #fff;
  background-color: #000;
}
</style>
