<script setup lang="ts">
/**
 * /notification — Perfil -> Suporte ("Centro de Mensagens").
 *
 * Three in-page tabs over one scroller. Default is "Suporte"; Notificação and
 * Anúncio render the same empty "Sem Registros" block the live account shows.
 * Geometry is the live page at 390x844x3; see
 * docs/research/gc987-com/notification/NOTIFICATION_PAGE.spec.md.
 */
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '../../components/base/SvgIcon.vue'
import MessageSegment from '../../components/perfil/notification/MessageSegment.vue'
import SupportPanel from '../../components/perfil/notification/SupportPanel.vue'
import { useNotificationStore } from '../../stores/notification'

const router = useRouter()
const notes = useNotificationStore()

function goBack() {
  if (router.options.history.state.back) router.back()
  else void router.push('/main/perfil')
}

onMounted(() => {
  notes.selectTab('suporte')
  void notes.load()
})
</script>

<template>
  <div class="ion-page">
    <header class="msg-header">
      <div class="toolbar">
        <button type="button" class="back" @click="goBack">
          <SvgIcon class="back-icon" name="report-back" />
        </button>
        <h1 class="toolbar-title"><span class="title-text">Centro de Mensagens</span></h1>
      </div>

      <div class="tab-box">
        <MessageSegment :tabs="notes.tabs" :active="notes.active" @select="notes.selectTab" />
      </div>
    </header>

    <div class="page-scroller msg-body" :class="{ padded: notes.active === 'suporte' }">
      <SupportPanel v-if="notes.active === 'suporte'" :channels="notes.channels" />

      <div v-else class="empty">
        <div class="empty-bg-img" />
        <span class="empty-label">Sem Registros</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.msg-header {
  position: relative;
  z-index: 10;
  flex: 0 0 auto;
}

/* ion-toolbar (ios): --background #154084, --min-height 3.125rem,
   --padding-start/end 4px. No elevation on this route. */
.toolbar {
  display: flex;
  position: relative;
  height: 3.125rem;
  min-height: 3.125rem;
  padding: 0 0.25rem;
  align-items: center;
  overflow: hidden;
  background-color: #154084;
}

.back {
  display: flex;
  width: 2.375rem;
  height: 1.375rem;
  padding-left: 0.125rem;
  margin: 0 0.125rem;
  justify-content: flex-start;
  align-items: center;
}

.back-icon {
  width: 1rem;
  height: 1rem;
  margin: 0 0.5rem;
  color: var(--color-text-100);
}

.toolbar-title {
  display: flex;
  position: absolute;
  inset: 0;
  padding: 0 5.625rem;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.875rem;
  color: var(--color-text-100);
  text-align: center;
  pointer-events: none;
}

.title-text {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* div.tab-box: 16px side padding on #090f1f, 51 tall with the hairline. */
.tab-box {
  padding: 0 1rem;
  overflow: hidden;
  background-color: rgb(9, 15, 31);
}

/* Suporte ion-content: --padding-start/end .9375rem. The other two tabs pad
   1rem and sit the 288-tall empty block at y=117. */
.msg-body.padded {
  padding: 0 0.9375rem;
}

.msg-body:not(.padded) {
  padding: 1rem;
}

.empty {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
}

.empty-bg-img {
  width: 7.5rem;
  height: 7.5rem;
  margin-top: 9rem;
  background: url('/images/promo-page/no-record.png') 0 0 / 7.5rem auto no-repeat;
}

.empty-label {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
  color: rgb(99, 100, 105);
}
</style>
