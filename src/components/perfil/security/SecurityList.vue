<script setup lang="ts">
/**
 * The two `.security-item` cards on /security.
 *
 * Each card is 370 wide at 390 with 10px side padding, radius 8, background
 * `#101629`. Rows are 48 tall `ion-item`s: icon 24×18, 12px/16px labels,
 * right value `rgb(155,167,190)`. Inset hairlines (except the last row of
 * a card) and the 15px 25%-white detail chevron on phone, email, and the
 * password rows.
 */
import { useRouter } from 'vue-router'
import SvgIcon from '../../base/SvgIcon.vue'
import type { SecurityRow } from '../../../api/security'

defineProps<{ groups: SecurityRow[][] }>()

const router = useRouter()

function onRow(row: SecurityRow) {
  if (row.to) void router.push(row.to)
}
</script>

<template>
  <div v-for="(group, gi) in groups" :key="gi" class="security-item">
    <div
      v-for="row in group"
      :key="row.key"
      class="row"
      :class="{ lined: row.lined }"
      @click="onRow(row)"
    >
      <SvgIcon class="row-icon" :name="row.icon" />
      <span class="label">{{ row.label }}</span>
      <span class="value">{{ row.value }}</span>
      <SvgIcon v-if="row.detail" class="row-chevron" name="chevron-forward" />
    </div>
  </div>
</template>

<style scoped>
/* .security-item: width 100%, padding 0 10px, radius 8, margin-bottom 10,
   background the page's --color-bg-200 override (#101629). */
.security-item {
  width: 100%;
  margin-bottom: 0.625rem;
  padding: 0 0.625rem;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: #101629;
}

/* ion-item: --min-height 48px, --padding-start 0, --inner-padding-end .25rem,
   font-size .75rem / line-height 1rem. */
.row {
  display: flex;
  position: relative;
  min-height: 3rem;
  padding-right: 0.25rem;
  align-items: center;
  overflow: hidden;
  font-size: 0.75rem;
  line-height: 1rem;
}

/* item-lines-inset: 1px --divider on the inner, which is the full 350-wide
   item because --padding-start is 0. */
.row.lined {
  border-bottom: 0.0625rem solid var(--divider);
}

/* ion-icon: width 1.5rem, margin 10px, painted 24×18 (height stays 1em of
   the icon's 18px font-size). */
.row-icon {
  width: 1.5rem;
  height: 1.125rem;
  margin: 0 0.625rem;
  color: var(--color-text-100);
}

.label {
  flex: 1 1 0%;
  min-width: 0;
  margin: 0.625rem 0;
  overflow: hidden;
  color: var(--color-text-100);
  text-overflow: ellipsis;
}

/* ion-label.security-item-right-color: --color-text-gray-300, margin-left 16px. */
.value {
  flex: 0 0 auto;
  margin: 0.625rem 0 0.625rem 1rem;
  color: rgb(155, 167, 190);
}

/* Ionic detail chevron: 1.25em of 12px = 15px, opacity .25, ml 2px, mr -6px. */
.row-chevron {
  width: 0.9375rem;
  height: 0.9375rem;
  margin: 0 -0.375rem 0 0.125rem;
  color: var(--color-text-100);
  opacity: 0.25;
}
</style>
