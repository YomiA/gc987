<script setup lang="ts">
/**
 * /notification tab 1 — "Suporte".
 *
 * A 360-wide "Apoio online 24/7" board plus three service rows. Geometry is
 * the live page at 390x844x3. The first card has no Contato because this
 * tenant's `onlineServices` list is empty; the three Contato links are the
 * public Telegram / WhatsApp channels from the live config.
 */
import { supportCopy as copy, type SupportChannel } from '../../../api/notification'

defineProps<{ channels: SupportChannel[] }>()
</script>

<template>
  <div class="board">
    <img class="avatar" :src="copy.avatar" alt="" />
    <div class="online">
      <p class="online-text">{{ copy.title }}</p>
      <p class="tips">{{ copy.hint }}</p>
    </div>
  </div>

  <div class="list">
    <div v-for="item in channels" :key="item.key" class="service-item">
      <img class="icon" :src="item.logo" alt="" />
      <div class="middle">
        <p class="nickname">{{ item.nickname }}</p>
        <p class="account">{{ item.account }}</p>
      </div>
      <a class="contato" :href="item.url" target="_blank" rel="noopener noreferrer">
        {{ copy.contact }}
      </a>
    </div>
  </div>
</template>

<style scoped>
/* .board: 360x82, padding 8, radius 6, #101629, margin-top 10, flex. */
.board {
  display: flex;
  width: 22.5rem;
  margin-top: 0.625rem;
  padding: 0.5rem;
  align-items: flex-start;
  border-radius: 0.375rem;
  background-color: #101629;
}

.avatar {
  width: 3.4375rem;
  height: 3.4375rem;
  flex: 0 0 auto;
  object-fit: contain;
}

.online {
  flex: 1 1 0%;
  min-width: 0;
  margin-left: 0.5rem;
}

.online-text {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.375rem;
  color: var(--color-text-100);
}

.tips {
  margin: 0.25rem 0;
  font-size: 0.6875rem;
  font-weight: 400;
  line-height: 1.125rem;
  color: rgb(155, 167, 190);
}

.list {
  width: 22.5rem;
}

/* .service-item: padding 10, radius 5, #101629, margin-top 10, space-between. */
.service-item {
  display: flex;
  width: 22.5rem;
  margin-top: 0.625rem;
  padding: 0.625rem;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.3125rem;
  background-color: #101629;
}

.icon {
  width: 2.5rem;
  height: 2.5rem;
  flex: 0 0 auto;
  object-fit: fill;
}

.middle {
  width: 13.4375rem;
  padding: 0 0.75rem;
  flex: 0 1 auto;
}

.nickname {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.125rem;
  color: var(--color-text-100);
}

.account {
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  color: rgb(109, 120, 141);
}

/* ion-button.cust-btn: 85x30, 0.7rem/500, radius 5, blue gradient. */
.contato {
  display: flex;
  width: 5.3125rem;
  height: 1.875rem;
  flex: 0 0 auto;
  justify-content: center;
  align-items: center;
  border-radius: 0.3125rem;
  background-image: linear-gradient(0deg, rgb(1, 103, 202) 0%, rgb(56, 168, 250) 100%);
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--color-text-100);
  text-decoration: none;
}
</style>
