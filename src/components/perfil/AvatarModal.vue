<script setup lang="ts">
/**
 * Bottom sheet on /main/perfil. Opens on the male list (POST /avatarOptions/1).
 * The female tab loads POST /avatarOptions/0. Confirm saves via POST /updateSelfInfo,
 * then /selfInfo supplies the avatar shown on the profile card.
 * Geometry is the live #avatar sheet at 390x844x3.
 */
import { onMounted, ref } from 'vue'
import SvgIcon from '../base/SvgIcon.vue'
import {
  avatarOptions,
  avatarOptionsOf,
  updateSelfInfo,
  type AvatarSex,
} from '../../api/user'
import { showToast } from '../../toast'
import { assetUrl } from '../../utils/assetUrl'
import { useUserStore } from '../../stores/user'

const emit = defineEmits<{ close: [] }>()

const user = useUserStore()
const sex = ref<AvatarSex>(1)
const paths = ref<string[]>([])
const selected = ref('')
let generation = 0

function sameAvatar(path: string) {
  const current = String(user.info?.avatar ?? '').trim()
  if (!current) return false
  return path === current || assetUrl(path) === assetUrl(current)
}

async function load(next: AvatarSex) {
  const token = ++generation
  sex.value = next
  selected.value = ''
  try {
    const resp = await avatarOptions(next)
    if (token !== generation) return
    const list = avatarOptionsOf(resp.data)
    paths.value = list
    selected.value = list.find((path) => sameAvatar(path)) ?? ''
  } catch (error) {
    if (token !== generation) return
    paths.value = []
    showToast(error instanceof Error ? error.message : String(error), 'error')
  }
}

function pickSex(next: AvatarSex) {
  if (sex.value === next) return
  void load(next)
}

function pick(path: string) {
  selected.value = path
}

async function confirm() {
  const avatar = selected.value
  if (!avatar) {
    emit('close')
    return
  }
  try {
    await updateSelfInfo(avatar)
  } catch (error) {
    showToast(error instanceof Error ? error.message : String(error), 'error')
    return
  }
  emit('close')
  try {
    await user.loadUserInfo()
  } catch (error) {
    showToast(error instanceof Error ? error.message : String(error), 'error')
  }
}

onMounted(() => {
  void load(1)
})
</script>

<template>
  <div class="overlay" @click="emit('close')">
    <div class="sheet" role="dialog" aria-label="Mudar avatar" @click.stop>
      <div class="toolbar">
        <button type="button" class="close" @click="emit('close')">
          <SvgIcon name="close" />
        </button>
        <div class="title">{{ tr('Mudar avatar') }}</div>
      </div>

      <div class="tabs">
        <button type="button" class="tab" :class="{ on: sex === 1 }" @click="pickSex(1)">
          <SvgIcon class="tab-icon" name="avatar-male" />
          <span>{{ tr('M') }}</span>
        </button>
        <button type="button" class="tab" :class="{ on: sex === 0 }" @click="pickSex(0)">
          <SvgIcon class="tab-icon" name="avatar-female" />
          <span>{{ tr('F') }}</span>
        </button>
      </div>

      <div class="grid-wrap">
        <div class="grid">
          <button
            v-for="path in paths"
            :key="path"
            type="button"
            class="cell"
            :class="{ on: selected === path }"
            @click="pick(path)"
          >
            <img :src="assetUrl(path)" alt="" />
          </button>
        </div>
      </div>

      <button type="button" class="submit" @click="confirm">{{ tr('Confirmar') }}</button>
    </div>
  </div>
</template>

<style scoped>
/* ion-modal#avatar is a full-viewport dimmer. The sheet sits on the bottom. */
.overlay {
  position: absolute;
  inset: 0;
  z-index: 20018;
  background: rgba(0, 0, 0, 0.6);
}

.sheet {
  display: flex;
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  max-height: 100%;
  flex-direction: column;
  padding: 0.5rem 1rem;
  background: #101629;
  animation: avatar-up 0.28s ease;
}

.toolbar {
  position: relative;
  height: 2.75rem;
  flex: 0 0 auto;
}

.close {
  display: flex;
  position: absolute;
  top: 50%;
  left: 0.6875rem;
  width: 1rem;
  height: 1rem;
  padding: 0;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #1a223a;
  border: 0;
  border-radius: 0.3125rem;
  transform: translateY(-50%);
}

.close :deep(.svg-icon) {
  width: 1rem;
  height: 1rem;
}

.title {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  line-height: 1.5rem;
  color: #fff;
  pointer-events: none;
}

.tabs {
  display: flex;
  flex: 0 0 auto;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.tab {
  display: flex;
  flex: 1 1 50%;
  align-items: center;
  justify-content: center;
  padding: 5px;
  color: #9ba7be;
  background: transparent;
  border: 0;
  border-bottom: 0.0625rem solid #1a233e;
  font: inherit;
}

.tab.on {
  color: #38a8fa;
  border-bottom-width: 0.125rem;
  border-bottom-color: #38a8fa;
}

.tab-icon {
  width: 1.375rem;
  height: 1.375rem;
}

.grid-wrap {
  flex: 1 1 auto;
  min-height: 0;
  padding: 0.625rem 0;
  overflow-y: auto;
  scrollbar-width: none;
}

.grid-wrap::-webkit-scrollbar {
  display: none;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
}

.cell {
  flex: 0 0 25%;
  max-width: 25%;
  padding: 5px;
  background: transparent;
  border: 0;
}

.cell img {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  box-sizing: border-box;
  object-fit: fill;
  border-radius: 0.625rem;
}

.cell.on img {
  border: 0.125rem solid #38a8fa;
}

.submit {
  flex: 0 0 auto;
  min-height: 2.5rem;
  margin: 0.25rem 3rem 1.25rem;
  padding: 0;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5rem;
  background: linear-gradient(0deg, #0167ca 0%, #38a8fa 100%);
  border: 0;
  border-radius: 0.625rem;
}

@keyframes avatar-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
