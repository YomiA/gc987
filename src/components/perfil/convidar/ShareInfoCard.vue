<script setup lang="ts">
/**
 * "Informação de Referência" — the QR tile with its Salvar strip, the referral
 * link box with share/copy actions, and the scrollable row of share targets.
 *
 * Live geometry: 370x223 card, 75x100 QR tile (its 28-tall Salvar strip
 * overflows the tile by 3px and is clipped, same as the original), 250-wide
 * link column, 340x40 share row holding nine 35px glyphs.
 *
 * The QR bitmap itself is drawn client-side from the account's real referral
 * link, so only the live placeholder tile is reproduced here.
 */
import SvgIcon from '../../base/SvgIcon.vue'
import type { SpreadShareInfo } from '../../../api/spread'

defineProps<{ share: SpreadShareInfo }>()
</script>

<template>
  <section class="agent-share-info">
    <div class="referral-tips">Informação de Referência</div>

    <div class="body">
      <div class="row">
        <div class="qr-block">
          <div class="qr-pad">
            <div class="qr" />
          </div>
          <div class="save-qrcode-btn">Salvar</div>
        </div>

        <div class="link-col">
          <p class="link-title">Meu link</p>
          <div class="agent-share-link">
            <div class="link-text">{{ share.link }}</div>
            <div class="link-actions">
              <SvgIcon class="act share" name="convidar-share" />
              <SvgIcon class="act copy" name="convidar-copy" />
            </div>
          </div>
        </div>
      </div>

      <div class="social-scroll">
        <button
          v-for="social in share.socials"
          :key="social.key"
          type="button"
          class="social"
          :class="social.key"
        >
          <SvgIcon class="social-icon" :name="social.icon" />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.agent-share-info {
  flex: 0 0 auto;
  padding: 0.625rem 0.9375rem;
  border-radius: 0.625rem;
  background-color: #101629;
  color: var(--color-text-100);
}

.referral-tips {
  padding-bottom: 0.8125rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-bottom: 1px solid rgb(42, 50, 78);
}

.row {
  display: flex;
  margin: 0.625rem 0;
  justify-content: space-around;
}

/* The tile clips the Salvar strip, which cannot shrink below its 28px line. */
.qr-block {
  display: flex;
  min-width: 4.6875rem;
  height: 6.25rem;
  margin-right: 0.625rem;
  flex-direction: column;
  border-radius: 0.3125rem;
  overflow: hidden;
  background-color: rgb(23, 36, 79);
}

.qr-pad {
  display: flex;
  padding: 0.3125rem;
  justify-content: center;
}

.qr {
  width: 4.0625rem;
  height: 4.0625rem;
  background-color: #bebebe;
}

.save-qrcode-btn {
  flex: 1 1 0%;
  background-color: rgb(22, 128, 220);
  font-size: 0.625rem;
  line-height: 1.75rem;
  text-align: center;
}

.link-col {
  display: flex;
  flex: 1 1 0%;
  max-width: 15.625rem;
  flex-direction: column;
  font-size: 0.625rem;
  line-height: 0.9375rem;
}

.link-title {
  margin-bottom: 0.4375rem;
}

.agent-share-link {
  display: flex;
  padding: 0.3125rem;
  justify-content: space-between;
  border: 0.0625rem solid rgb(26, 35, 62);
  border-radius: 0.3125rem;
}

.link-text {
  max-width: 12.5rem;
  color: rgb(155, 167, 190);
  overflow-wrap: break-word;
}

.link-actions {
  display: flex;
  padding: 0.75rem 0 0.75rem 0.25rem;
  flex-direction: column;
  justify-content: space-between;
}

.act {
  color: var(--color-text-100);
}

.share {
  width: 1.125rem;
  height: 1.125rem;
  margin-bottom: 0.6rem;
}

.copy {
  width: 1.25rem;
  height: 1.25rem;
}

/* ion-segment.segment-scrollable holding the share targets. */
.social-scroll {
  display: flex;
  height: 2.5rem;
  justify-content: flex-start;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
}

.social-scroll::-webkit-scrollbar {
  display: none;
}

/* ion-segment-button.ios on this page: padding 0, min-width 2.35rem,
   min/max-height 2.5rem, margin 0 0.375rem. ion-icon is 2.1875rem; overflow
   stays visible so WhatsApp's tail is not clipped (contain:strict was). */
.social {
  display: flex;
  flex: 0 0 auto;
  padding: 0;
  margin: 0 0.375rem;
  min-width: 2.35rem;
  min-height: 2.5rem;
  max-height: 2.5rem;
  justify-content: center;
  align-items: center;
  border-radius: 0.375rem;
}

.social-icon {
  width: 2.1875rem;
  height: 2.1875rem;
  overflow: visible;
}
</style>
