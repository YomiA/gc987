<script setup lang="ts">
/**
 * The account block at the top of /spread — ids, collectable commission, the
 * Receber/Histórico pair and the settlement-window note.
 *
 * Live geometry: 370x138 card (97 for the info row, 41 for the note row),
 * #101629 with a 10px radius. Receber renders in its disabled grey on this
 * account, which is the colour reproduced here.
 */
import type { SpreadAgentInfo } from '../../../api/spread'

defineProps<{ info: SpreadAgentInfo }>()
</script>

<template>
  <section class="agent-info">
    <div class="info">
      <div class="ids">
        <div class="row"><span class="minor">MeuID:</span><span class="value">{{ info.myId }}</span></div>
        <div class="row"><span class="minor">ConvidadorID:</span><span class="value">{{ info.inviterId }}</span></div>
        <div class="row collect">Coletável <span class="money">{{ info.collectable }}</span></div>
      </div>

      <div class="actions">
        <button type="button" class="btn receber">Receber</button>
        <button type="button" class="btn historico">Histórico</button>
      </div>
    </div>

    <div class="receive-rule">
      <div class="text"><span class="hint">{{ info.hint }}</span></div>
    </div>
  </section>
</template>

<style scoped>
.agent-info {
  position: relative;
  flex: 0 0 auto;
  margin-bottom: 0.625rem;
  border-radius: 0.625rem;
  /* The live ion-toolbar paints its background in a square child and relies on
     `contain: content` to round it off. */
  overflow: hidden;
  background-color: #101629;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--color-text-100);
}

.info {
  display: flex;
  padding: 0.625rem;
}

.ids {
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
}

.row {
  margin-bottom: 0.625rem;
}

.minor {
  line-height: 1.0625rem;
  color: rgb(155, 167, 190);
}

.row.collect {
  margin-bottom: 0;
  line-height: 1.0625rem;
}

.money {
  line-height: 1.0625rem;
  color: rgb(251, 165, 49);
}

.actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* ion-button (small, solid, md): 30 tall, 4px radius, md elevation-2. */
.btn {
  height: 1.875rem;
  min-height: 1.70625rem;
  padding: 0.25rem 0.73125rem;
  border-radius: 0.25rem;
  box-shadow:
    0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.25rem;
  color: var(--color-text-100);
  text-align: center;
}

.receber {
  margin-bottom: 0.625rem;
  background-color: rgb(141, 141, 141);
}

.historico {
  background-color: rgb(255, 182, 113);
}

.receive-rule {
  display: flex;
  padding: 0 0.625rem;
  justify-content: space-between;
  border-bottom: 0.0625rem solid rgb(26, 35, 62);
}

.receive-rule .text {
  width: 80%;
}

.hint {
  line-height: 1.0625rem;
  color: rgba(255, 255, 255, 0.4);
}
</style>
