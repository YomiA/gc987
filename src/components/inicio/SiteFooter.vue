<script setup lang="ts">
defineProps<{ terms: string }>()
</script>

<template>
  <div class="footer">
    <div class="divider" />
    <div class="footer-container">
      <div class="keep-space">
        <p class="terms">{{ terms.split('\n\n').map((item) => tr(item)).join('\n\n') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.footer {
  width: 24.375rem;
}

.divider {
  width: 22.5rem;
  height: 0.0625rem;
  margin-top: 0.9375rem;
  margin-left: 0.9375rem;
  background-color: var(--divider);
}

.footer-container {
  width: 24.375rem;
  padding: 1.0625rem 0.9375rem 0;
}

.keep-space {
  width: 22.5rem;
  margin-top: 0.625rem;
  margin-bottom: 0.875rem;
  white-space: pre-wrap;
}

.terms {
  width: 22.5rem;
  min-height: 1.25rem;
  font-size: 0.6875rem;
  line-height: 1.25rem;
  color: var(--text-muted);
}
</style>
