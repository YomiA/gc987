<script setup lang="ts">
import SvgIcon from '../base/SvgIcon.vue'
</script>

<template>
  <div class="install-container">
    <div class="top-line">Baixar o aplicativo</div>
    <div class="middle-line">
      Baixe e instale o aplicativo no seu desktop para uma experiência de jogo mais fluida
    </div>
    <div class="store-row">
      <div class="store-col">
        <div class="store-btn">
          <SvgIcon class="store-icon apple" name="apple" />
          <div>
            <p class="store-sub">Aplicativo</p>
            <p class="store-text">Baixar iOS</p>
          </div>
        </div>
      </div>
      <div class="store-col">
        <div class="store-btn">
          <SvgIcon class="store-icon" name="android" />
          <div>
            <p class="store-sub">Aplicativo</p>
            <p class="store-text">Baixar Android</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.install-container {
  width: 24.375rem;
  height: 21.82275rem;
  margin: 0.625rem 0;
  padding: 5.5744rem 0.375rem 0 1rem;
  font-size: 0.625rem;
  line-height: 0.9375rem;
  background-image: url('/images/bg/appInstallBg.png');
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
}

.top-line {
  width: 23rem;
  height: 2.4375rem;
  margin-bottom: 1rem;
  font-size: 1.625rem;
  font-weight: 800;
  line-height: 2.4375rem;
  color: rgba(0, 0, 0, 0);
  background-image:
    linear-gradient(0deg, rgb(191, 241, 255), rgb(191, 241, 255)),
    linear-gradient(rgb(255, 255, 255), rgba(255, 255, 255, 0));
  background-clip: text;
  -webkit-background-clip: text;
  box-shadow: rgba(0, 0, 0, 0.14) 0 0.13rem 0.26rem 0;
}

.middle-line {
  width: 23rem;
  height: 2.625rem;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.3125rem;
  color: var(--text-muted);
}

.store-row {
  display: flex;
  width: 23rem;
  height: 2.625rem;
  margin-top: 1.875rem;
  flex-wrap: wrap;
}

.store-col {
  position: relative;
  width: 11.5rem;
  height: 2.625rem;
  max-width: 50%;
  padding: 0 0.375rem;
  flex: 0 0 50%;
}

.store-btn {
  display: flex;
  width: 10.75rem;
  height: 2.625rem;
  padding-left: 2.5rem;
  align-items: center;
  background-color: rgb(255, 255, 255);
  border: 0.0625rem solid rgb(49, 52, 61);
  border-radius: 0.625rem;
}

.store-icon {
  width: 1.875rem;
  height: 1.875rem;
  margin-right: 0.3125rem;
  font-size: 1.875rem;
}

.store-icon.apple {
  color: rgb(0, 0, 0);
}

.store-sub {
  font-size: 0.5rem;
  line-height: 0.75rem;
  color: rgb(7, 13, 31);
}

.store-text {
  font-weight: 700;
  color: rgb(64, 117, 211);
}
</style>
