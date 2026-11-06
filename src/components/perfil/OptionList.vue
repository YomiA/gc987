<script setup lang="ts">
/**
 * The six-row list at the bottom of /main/perfil (358x326 at (16,347)).
 *
 * The live rows are `ion-item`s with `--padding-start: 0`, `--padding-top/-bottom:
 * .75rem` and `item-lines-none`; the detail chevron ends 10px short of the card
 * edge because of `--inner-padding-end: 16px` plus its own -6px right margin,
 * which is what the row's `padding-right` reproduces here.
 */
import SvgIcon from "../base/SvgIcon.vue";
import type { PerfilOption } from "../../api/perfil";
import { tr } from "../../i18n/tr";

const props = defineProps<{ items: PerfilOption[] }>();
const emit = defineEmits<{ select: [key: string] }>();

/** The invite line names the site. The host replaces the GC987.COM token. */
const siteDomain = location.hostname.replace(/^www\./i, "").toUpperCase();

function noteText(note: string) {
  return tr(note).split("GC987.COM").join(siteDomain);
}
</script>

<template>
  <div class="option card-bg-gradient">
    <div
      v-for="item in props.items"
      :key="item.key"
      class="row"
      @click="emit('select', item.key)"
    >
      <div class="left">
        <img class="row-icon" :src="item.icon" alt="" />
        <span class="label">{{ tr(item.label) }}</span>
      </div>
      <div class="middle">
        <span v-if="item.note" class="invite-text">{{
          noteText(item.note)
        }}</span>
      </div>
      <SvgIcon class="row-chevron" name="chevron-forward" />
    </div>
  </div>
</template>

<style scoped>
/* ion-content .option { width: 100%; padding-left: 1rem; border-radius: .5rem } */
.option {
  width: 100%;
  padding-left: 1rem;
  border-radius: 0.5rem;
  background: var(--pwa-bar-bg);
}

/* ion-item --padding-top/-bottom .75rem; --inner-padding-end stays 16px. */
.row {
  display: flex;
  position: relative;
  padding: 0.75rem 16px 0.75rem 0;
  align-items: center;
  font-size: 0.75rem;
  cursor: pointer;
}

/* Slotted .left { margin-right: 16px } — Ionic keeps this in px. */
.left {
  display: flex;
  margin-right: 16px;
  align-items: center;
}

.row-icon {
  width: 1.875rem;
  height: 1.875rem;
  margin-right: 0.625rem;
  object-fit: contain;
}

.label {
  color: var(--color-text-100);
}

.middle {
  display: flex;
  flex: 1 1 0%;
  justify-content: flex-end;
}

/* ion-label { flex: 2.5 1 0%; text-align: right; font-size: .625rem;
   max-width: 13rem }, .invite-text { color: var(--color-text-gray-100) } */
.invite-text {
  display: block;
  flex: 2.5 1 0%;
  max-width: 13rem;
  font-size: 0.625rem;
  color: rgb(135, 146, 175);
  text-align: right;
}

/* item-detail-icon: 1.25em, margin 0 -6px 0 8px. Together with the 16px
   inner-end padding this leaves 10px clear of the card edge. */
.row-chevron {
  width: 0.9375rem;
  height: 0.9375rem;
  margin: 0 -6px 0 8px;
  color: rgb(155, 167, 190);
}
</style>
