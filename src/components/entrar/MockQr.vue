<script setup lang="ts">
/**
 * Seeded QR-looking 29×29 grid. Live draws a 450px canvas scaled to 150×150
 * from a real PIX payload; this clone never encodes that payload.
 */
import { computed } from 'vue'

const props = defineProps<{ payload: string }>()

const SIZE = 29

function inFinder(x: number, y: number, n: number): boolean {
  return (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8)
}

const modules = computed(() => {
  const n = SIZE
  const grid: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false))

  function finder(ox: number, oy: number) {
    for (let dy = 0; dy < 7; dy++) {
      for (let dx = 0; dx < 7; dx++) {
        const edge = dx === 0 || dx === 6 || dy === 0 || dy === 6
        const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4
        grid[oy + dy][ox + dx] = edge || core
      }
    }
  }

  finder(0, 0)
  finder(n - 7, 0)
  finder(0, n - 7)

  for (let i = 8; i < n - 8; i++) {
    grid[6][i] = i % 2 === 0
    grid[i][6] = i % 2 === 0
  }

  let h = 2166136261
  for (const ch of props.payload) {
    h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  }
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (inFinder(x, y, n) || x === 6 || y === 6) continue
      h = Math.imul(h ^ (x * 31 + y), 16777619)
      grid[y][x] = (h >>> 0) % 2 === 0
    }
  }
  return grid
})

const darkCells = computed(() => {
  const cells: { x: number; y: number }[] = []
  modules.value.forEach((row, y) => {
    row.forEach((on, x) => {
      if (on) cells.push({ x, y })
    })
  })
  return cells
})
</script>

<template>
  <svg
    class="qr"
    :viewBox="`0 0 ${SIZE} ${SIZE}`"
    width="150"
    height="150"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-hidden="true"
  >
    <rect width="29" height="29" fill="#fff" />
    <rect
      v-for="(cell, i) in darkCells"
      :key="i"
      :x="cell.x"
      :y="cell.y"
      width="1"
      height="1"
      fill="#000"
    />
  </svg>
</template>

<style scoped>
.qr {
  display: block;
  width: 9.375rem;
  height: 9.375rem;
}
</style>
