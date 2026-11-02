<script setup lang="ts">
/**
 * Top card of /main/perfil: avatar, id + copy, VIP badge, account, balance and
 * the Saque / Depósito pair. Geometry is the live card at 390x844x3
 * (358x177 at (16,30)); see docs/research/gc987-com/main-perfil/PERFIL_PAGE.spec.md.
 */
import SvgIcon from '../base/SvgIcon.vue'
import { formatAmount } from '../../api/promo'
import type { PerfilProfile } from '../../api/perfil'

const props = defineProps<{ profile: PerfilProfile }>()
</script>

<template>
  <div class="user card-bg-gradient">
    <div class="top">
      <div class="avatar">
        <img :src="props.profile.avatar" alt="" />
      </div>

      <div class="messsage">
        <div class="id-row">
          <span><span class="user-id">ID: </span> {{ props.profile.id }}</span>
          <SvgIcon class="copy-icon" name="perfil-copy" />
          <div class="level">
            <img class="crown" :src="props.profile.crown" alt="" />
            <div class="level-badge">
              <span :style="{ color: props.profile.levelBadgeColor }">
                {{ props.profile.levelBadge }}
              </span>
            </div>
          </div>
        </div>

        <div class="account-row"><span class="user-account">Conta:</span> {{ props.profile.account }}</div>

        <div class="money-row">
          <!-- The live page keeps a zero-opacity copy of the amount so the
               absolutely positioned one it animates has a width to sit in. -->
          <div class="balance-wrapper">
            <span class="balance-placeholder">{{ formatAmount(props.profile.balance) }}</span>
            <span class="balance-display">{{ formatAmount(props.profile.balance) }}</span>
          </div>
          <span class="currency">R$</span>
          <SvgIcon class="refresh-icon" name="perfil-refresh" />
        </div>
      </div>

      <div class="email">
        <SvgIcon class="email-icon" name="perfil-email" />
      </div>
    </div>

    <div class="bottom">
      <div class="col">
        <div class="enter-btn withdraw">
          <SvgIcon class="btn-icon" name="perfil-saque" />
          <span class="enter-withdraw-text">Saque</span>
        </div>
      </div>
      <div class="col">
        <div class="enter-btn deposit">
          <SvgIcon class="btn-icon" name="perfil-deposito" />
          <span class="enter-withdraw-text">Depósito</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ion-content .user { width: 100%; padding: .875rem .625rem; border-radius: .5rem }
   .card-bg-gradient { background: var(--theme-color-gradient-300) }, whose
   resolved value is the gradient this clone already stores as --pwa-bar-bg. */
.user {
  width: 100%;
  padding: 0.875rem 0.625rem;
  border-radius: 0.5rem;
  background: var(--pwa-bar-bg);
}

.top {
  display: flex;
}

/* ion-thumbnail.avatar { --size: 4.75rem; --border-radius: .5rem } */
.avatar {
  flex: 0 0 auto;
  width: 4.75rem;
  height: 4.75rem;
  border-radius: 0.5rem;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.messsage {
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 0.625rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.id-row {
  display: flex;
  align-items: flex-end;
}

.user-id,
.user-account {
  color: var(--color-text-100);
}

.copy-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-left: 0.125rem;
  color: var(--color-text-100);
}

.level {
  position: relative;
  width: 2.1875rem;
  height: 2.1875rem;
  margin-left: 0.25rem;
  transform: translateY(0.3125rem);
}

.level .crown {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.level-badge {
  display: flex;
  position: absolute;
  top: 0.6875rem;
  left: 0.75rem;
  width: 1.875rem;
  justify-content: center;
  align-items: center;
  font-size: 0.5rem;
  font-weight: 600;
  text-align: center;
}

.money-row {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
}

.balance-wrapper {
  position: relative;
  margin-right: 0.5rem;
  overflow: hidden;
}

.balance-placeholder {
  opacity: 0;
}

.balance-display {
  position: absolute;
  top: 0;
  left: 0;
  white-space: nowrap;
}

.currency {
  margin-right: 0.75rem;
}

/* .money-color ion-icon { font-size: 1.5rem; transform: rotate(30deg) } */
.refresh-icon {
  width: 1.5rem;
  height: 1.5rem;
  transform: rotate(30deg);
}

.email {
  position: relative;
  width: 1.75rem;
}

.email-icon {
  width: 1.6rem;
  height: 1.6rem;
}

/* ion-row.bottom { margin-top: 1.25rem } with two 50% ion-col. ion-col padding
   stays 5px at 390 and 1440 (not 0.3125rem). */
.bottom {
  display: flex;
  margin-top: 1.25rem;
}

.col {
  flex: 0 0 50%;
  max-width: 50%;
  padding: 5px;
}

.enter-btn {
  display: flex;
  padding: 0.5rem 0;
  justify-content: center;
  align-items: center;
  border-radius: 0.375rem;
}

/* div.left { background: var(--color-border-600) } */
.withdraw {
  background: rgb(42, 50, 78);
}

/* div.right { background: var(--theme-color-gradient-200) }, the same value
   this clone already stores as --btn-green. */
.deposit {
  background: var(--btn-green);
}

.btn-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.625rem;
}

.enter-withdraw-text {
  color: var(--color-text-100);
}
</style>
