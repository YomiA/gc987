<script setup lang="ts">
/**
 * /game/action/:id — game launch chrome.
 *
 * The card opens this route. POST /enterProduct returns the game link, shown
 * in the frame. The top-left Lobby chip calls POST /logoutTransfer and goes back.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SvgIcon from '../components/base/SvgIcon.vue'
import { enterProduct, gameLinkOf, logoutTransfer } from '../api/home'
import { i18n } from '../i18n'
import { showToast } from '../toast'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const gameUrl = ref('')
let started = false
let left = false

function goBack() {
  if (router.options.history.state.back) router.back()
  else void router.replace('/main/inicio')
}

async function leaveGame() {
  if (left) return
  left = true
  if (started) {
    try {
      await logoutTransfer()
    } catch (error) {
      showToast(error instanceof Error ? error.message : String(error), 'error')
    }
  }
  goBack()
}

onMounted(async () => {
  const id = route.params.id
  if (id == null || id === '') {
    loading.value = false
    return
  }
  started = true
  try {
    const resp = await enterProduct(String(id))
    if (left) return
    const link = gameLinkOf(resp.data)
    if (!link) {
      showToast(String(i18n.global.t('login.requestFailed')), 'error')
      left = true
      goBack()
      return
    }
    gameUrl.value = link
  } catch (error) {
    if (left) return
    showToast(error instanceof Error ? error.message : String(error), 'error')
    started = false
    left = true
    goBack()
  }
})

onBeforeUnmount(() => {
  if (left || !started) return
  left = true
  void logoutTransfer().catch(() => undefined)
})
</script>

<template>
  <div class="ion-page game-page">
    <button type="button" class="lobby" @click="leaveGame">
      <SvgIcon class="home" name="game-lobby-home" />
      <p class="label"> Lobby </p>
    </button>
    <iframe
      v-if="gameUrl"
      class="game-frame"
      :src="gameUrl"
      title="game"
      allow="fullscreen; autoplay; clipboard-write; encrypted-media"
      @load="loading = false"
    />
    <div v-if="loading" id="placeholder">Loading...</div>
  </div>
</template>

<style scoped>
.game-page {
  overflow: hidden;
  background-color: #000;
}

.game-frame {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  border: 0;
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
  z-index: 2;
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
