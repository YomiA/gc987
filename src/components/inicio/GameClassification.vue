<script setup lang="ts">
import { useRouter } from 'vue-router'
import { categoryPlatforms } from '../../api/mock'

defineProps<{ genres: string[]; brands: string[] }>()
const router = useRouter()

function openGenre(genre: string) {
  if (genre !== 'Slot') return
  void router.push('/game/category/ELECTRONIC/0')
}

function openBrand(brand: string) {
  const hit = categoryPlatforms.find((item) => item.label.toLowerCase() === brand.toLowerCase())
  void router.push(`/game/category/ELECTRONIC/${hit?.key ?? '0'}`)
}
</script>

<template>
  <div class="classification">
    <div class="head">
      <img class="logo" src="/images/brand/LOGO.png" alt="" />
      <span class="welcome">Bem-vindo à gc987.com</span>
    </div>

    <div class="intro">
      <p>©2026 gc987.com Todos os direitos reservados <span class="age">21+</span></p>
    </div>

    <section class="row">
      <div class="col">
        <span class="col-title">Gênero de jogo</span>
        <ul class="list">
          <li
            v-for="(genre, i) in genres"
            :key="genre"
            :class="{ active: i === 0, link: genre === 'Slot' }"
            @click="openGenre(genre)"
          >
            {{ genre }}
          </li>
        </ul>
      </div>
      <div class="col">
        <span class="col-title">Marca de games</span>
        <ul class="list platform-list">
          <li v-for="brand in brands" :key="brand" class="link" @click="openBrand(brand)">
            {{ brand }}
          </li>
        </ul>
      </div>
    </section>

    <!-- The live page renders a second, empty row here; it contributes its
         20px top margin to the block height. -->
    <section class="row" />
  </div>
</template>

<style scoped>
.classification {
  width: 22.5rem;
  margin: 2.8125rem 0.9375rem;
}

.head {
  display: flex;
  height: 3.1875rem;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 6.9375rem;
  height: 1.625rem;
  object-fit: contain;
}

.welcome {
  height: 1.125rem;
  margin-top: 0.4375rem;
  font-size: 0.75rem;
  line-height: 1.125rem;
  color: rgba(255, 255, 255, 0.4);
}

.intro {
  width: 22.5rem;
  height: 1.3125rem;
  margin-bottom: 2.8125rem;
  font-size: 0.6875rem;
  line-height: 1.03125rem;
  text-align: center;
  color: var(--text-dim);
}

.age {
  font-size: 0.875rem;
  font-weight: 800;
  line-height: 1.3125rem;
}

.row {
  display: flex;
  width: 22.5rem;
  margin-top: 1.25rem;
  padding: 0 1.5625rem 0 3.125rem;
}

.col {
  width: 8.90625rem;
  flex: 0 0 50%;
}

.col-title {
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.3125rem;
}

.list {
  width: 8.90625rem;
  margin-top: 1rem;
}

.list li {
  display: list-item;
  width: 8.90625rem;
  height: 1.574706rem;
  font-size: 0.875rem;
  line-height: 1.575rem;
  color: var(--text-muted);
}

.list li.active {
  color: rgb(255, 255, 255);
}

.list li.link {
  cursor: pointer;
}

.platform-list {
  max-height: 9.6875rem;
  overflow: auto;
  scrollbar-width: none;
}

.platform-list::-webkit-scrollbar {
  display: none;
}
</style>
