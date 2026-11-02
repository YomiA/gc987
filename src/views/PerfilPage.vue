<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import OptionList from '../components/perfil/OptionList.vue'
import LogoutModal from '../components/perfil/LogoutModal.vue'
import ProfileCard from '../components/perfil/ProfileCard.vue'
import VipProgressCard from '../components/perfil/VipProgressCard.vue'
import TabBar from '../components/inicio/TabBar.vue'
import { useHomeStore } from '../stores/home'
import { usePerfilStore } from '../stores/perfil'
import { usePromoStore } from '../stores/promo'

const router = useRouter()
const home = useHomeStore()
const perfil = usePerfilStore()
const promo = usePromoStore()
const logoutOpen = ref(false)

function onTabSelect(key: string) {
  if (key === 'inicio') {
    void router.push('/main/inicio')
    return
  }
  if (key === 'promo') {
    void router.push('/main/promo')
    return
  }
  if (key === 'deposito') {
    void router.push('/main/entrar')
    return
  }
  if (key === 'saque') {
    void router.push('/main/withdraw')
    return
  }
  home.selectTab(key)
}

function goActivityVip() {
  void router.push('/activity/vip')
}

/** Every live row is a route push; only the ones already cloned are wired. */
function onOptionSelect(key: string) {
  if (key === 'relatorios') void router.push('/user/report')
  if (key === 'convidar') void router.push('/spread')
  if (key === 'resgate') {
    // Live ion-item goes to /main/promo with the Código de Resgate segment
    // already checked — same URL as the Promoção tab, no extra route.
    promo.selectTab('resgate')
    void router.push('/main/promo')
  }
  if (key === 'suporte') void router.push('/notification')
  if (key === 'seguranca') void router.push('/security')
  if (key === 'sair') logoutOpen.value = true
}

/** Live Sair posts logout then leaves the session. Intentionally empty. */
function logout() {}

onMounted(() => {
  // The bottom bar is the app-level one shared with /main/inicio, so its items
  // come from the same store even when this route is opened directly.
  void home.load()
  void perfil.load()
})
</script>

<template>
  <div class="ion-page">
    <div class="page-scroller perfil-content">
      <ProfileCard v-if="perfil.profile" :profile="perfil.profile" />
      <VipProgressCard v-if="perfil.vip" :vip="perfil.vip" @click="goActivityVip" />
      <OptionList :items="perfil.options" @select="onOptionSelect" />
      <div class="bottom-spacer" />
    </div>

    <TabBar :items="home.tabBarItems" active="perfil" @select="onTabSelect" />

    <LogoutModal v-if="logoutOpen" @cancel="logoutOpen = false" @sair="logout" />
  </div>
</template>

<style scoped>
/* ion-content on this route: --background #090f1f, --padding 1rem on all four
   sides, inherited type 12px/16px. */
.perfil-content {
  padding: 1rem;
  font-size: 0.75rem;
  line-height: 1rem;
  background-color: var(--color-bar-bg);
}

/* The live rhythm is a single `ion-content > * + * { margin-top: .875rem }`.
   Its first child is the ion-refresher, which this clone does not have, so the
   rule applies to every child here instead — same 14px above the first card. */
.perfil-content > * {
  margin-top: 0.875rem;
}

/* Live spacer: height calc(56px + 1.5rem) on the 390 column, calc(70px + 1.5rem)
   once the tab bar switches to its 70px desktop min-height. */
.bottom-spacer {
  height: calc(56px + 1.5rem);
}

@media (min-width: 486px) {
  .bottom-spacer {
    height: calc(70px + 1.5rem);
  }
}
</style>
