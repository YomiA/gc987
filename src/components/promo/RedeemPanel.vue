<script setup lang="ts">
import { ref } from 'vue'

const code = ref('')
</script>

<template>
  <div class="page-scroller redeem-scroll">
    <div class="redeem-root">
      <!-- Live page opens with a banner slot that is empty for this activity.
           It still counts: the clipped box keeps its 10px top margin from
           collapsing into the title's, which is what puts the title 40px below
           the content edge. -->
      <div class="banner-slot" />
      <p class="title">{{ tr('Por favor, insira o código de resgate') }}</p>

      <div class="input-wrap">
        <input
          v-model="code"
          class="code-input"
          type="text"
          :placeholder="tr('Por favor, insira o código de resgate')"
        />
      </div>

      <div class="submit-row">
        <button type="button" class="submit">{{ tr('Resgatar Bônus') }}</button>
      </div>

      <!-- Live page keeps an empty description block under the button. -->
      <div class="description"><p /></div>
    </div>
  </div>
</template>

<style scoped>
/* ion-content: --padding-top 10px, --padding-start/-end 15px, --background #090f1f. */
.redeem-scroll {
  padding: 0.625rem 0.9375rem 0;
  background-color: #090f1f;
}

.redeem-root {
  padding-bottom: 4.5rem;
}

.banner-slot {
  margin-top: 0.625rem;
  overflow: hidden;
  border-radius: 0.625rem;
}

.title {
  margin-top: 1.875rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5rem;
  color: #fff;
}

.input-wrap {
  display: flex;
  margin: 1.25rem 0;
  padding: 0.25rem 0.625rem;
  justify-content: center;
  align-items: center;
  border: 1px solid rgb(42, 50, 78);
  border-radius: 6px;
}

.code-input {
  width: 100%;
  height: 2.375rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: #fff;
  background: transparent;
  border: 0;
  outline: none;
}

.code-input::placeholder {
  color: #fff;
  opacity: 0.6;
}

/* flow-root, because the live ion-button is inline-block: its 4px margins stay
   inside this row instead of collapsing through it. */
.submit-row {
  display: flow-root;
}

/* ion-button.redemption: 4px/2px margins, so the block does overhang the
   15px gutter by 2px on the right, exactly as on the live page. */
.submit {
  display: flex;
  width: 100%;
  height: 2.5rem;
  margin: 0.25rem 0.125rem;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: #fff;
  background-image: linear-gradient(0deg, rgb(1, 103, 202) 0%, rgb(56, 168, 250) 100%);
  border-radius: 0.625rem;
}

.description {
  margin-bottom: 2.5rem;
  padding-top: 1.875rem;
  font-size: 0.75rem;
  line-height: 1rem;
  color: rgba(255, 255, 255, 0.4);
}
</style>
