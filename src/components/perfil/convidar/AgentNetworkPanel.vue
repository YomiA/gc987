<script setup lang="ts">
/**
 * /spread tab 2 — "Rede de Agentes".
 *
 * Three blocks over the full-width scroller: the A-agent summary card, the
 * worked A/B/C tree (nine absolutely positioned arrow layers under the node
 * rows) and the static tutorial article.
 *
 * All offsets are the live page's measured values converted to rem, because
 * this project scales the root font-size with the viewport. Arrow rotations
 * come from the live `transform` matrices: b1 +30deg, b3 -30deg, c2 -28deg,
 * c3-toA mirrored on X. See
 * docs/research/gc987-com/spread/CONVIDAR_PAGE.spec.md.
 */
import SvgIcon from '../../base/SvgIcon.vue'
import type { SpreadNetwork } from '../../../api/spread'

defineProps<{ network: SpreadNetwork }>()
</script>

<template>
  <div class="net">
    <section class="self">
      <div class="self-row">
        <div class="people self-avatar" :style="{ backgroundImage: `url(${network.self.avatar})` }">
          <div class="badge badge-a">{{ tr(network.self.badge) }}</div>
        </div>

        <ul class="self-list">
          <li v-for="row in network.self.rows" :key="row.label">
            <span class="line">{{ tr(row.total) }}</span>
            <span class="line">{{ tr(row.label) }} <em class="money">{{ tr(row.value) }}</em></span>
          </li>
        </ul>
      </div>
    </section>

    <section class="tree">
      <div class="arrow arrow-c2-toa"><SvgIcon class="arrow-lg" name="spread-arrow-c2" /></div>
      <div class="arrow arrow-c1-toa"><SvgIcon class="arrow-lg" name="spread-arrow-c1" /></div>
      <div class="arrow arrow-c3-toa"><SvgIcon class="arrow-lg" name="spread-arrow-c1" /></div>

      <div class="row-b">
        <div
          v-for="chip in network.chips.filter((c) => c.key !== 'c2')"
          :key="chip.key"
          class="chip chip-toa"
          :class="`chip-${chip.key}`"
        >
          <span
            >{{ tr(chip.label) }} <em class="money">{{ tr(chip.value) }}</em><br />
            {{ tr(chip.note) }}</span
          >
        </div>

        <ul class="nodes nodes-b">
          <li v-for="(node, index) in network.rowB" :key="node.badge" class="agent-item">
            <div class="arrow" :class="`arrow-b${index + 1}`">
              <SvgIcon class="arrow-sm" name="spread-arrow-b" />
            </div>

            <div class="chip node-chip">
              <span
                >{{ tr(node.label) }} <em class="money">{{ tr(node.value) }}</em></span
              >
            </div>

            <div class="valid">
              <span class="valid-text">{{ tr(node.valid) }}</span>
              <div class="people" :style="{ backgroundImage: `url(${node.avatar})` }">
                <div class="badge">{{ tr(node.badge) }}</div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="row-c">
        <div
          v-for="chip in network.chips.filter((c) => c.key === 'c2')"
          :key="chip.key"
          class="chip chip-toa chip-c2"
        >
          <span
            >{{ tr(chip.label) }} <em class="money">{{ tr(chip.value) }}</em><br />
            {{ tr(chip.note) }}</span
          >
        </div>

        <ul class="nodes">
          <li v-for="(node, index) in network.rowC" :key="node.badge" class="agent-item">
            <div class="arrow" :class="`arrow-c${index + 1}-tob`">
              <SvgIcon class="arrow-sm" name="spread-arrow-c" />
            </div>

            <div class="chip node-chip">
              <span
                >{{ tr(node.label) }} <em class="money">{{ tr(node.value) }}</em></span
              >
            </div>

            <div class="valid">
              <span class="valid-text">{{ tr(node.valid) }}</span>
              <div class="people" :style="{ backgroundImage: `url(${node.avatar})` }">
                <div class="badge">{{ tr(node.badge) }}</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section class="tutorial">
      <h1><strong>{{ tr('Um exemplo é o seguinte:') }}</strong></h1>
      <p>
        {{ tr('Suponha que as apostas efetivas atuais de 0 a 10.000 receberão uma comissão de 100 (ou seja, 1%) para cada 10.000, e o apostas efetivas acima de 10.000 receberão uma comissão de 300 para cada 10.000. (ou seja, 3%), A foi o primeiro a descobrir oportunidades de negócios neste site e imediatamente desenvolveu B1, B2 e B3. B1 desenvolveu ainda mais C1 e C2. B2 desenvolveu sem subordinados, e a B3 desenvolveu o relativamente poderoso C3. No segundo dia, a aposta efetiva de B1 é 500, a aposta efetiva de B2 é 3.000, a aposta efetiva de B3 é 2.000, a aposta efetiva de C1 é 1.000, a aposta efetiva de C2 é 2.000 e a aposta efetiva de C3 é de até 20.000.') }}
      </p>
      <div>{{ tr('Então o método de cálculo da renda entre eles é o seguinte:') }}</div>
      <ul>
        <li>
          <strong>{{ tr('1. Comissão de B1') }}</strong> {{ tr('(contribuições diretas de C1 e C2) = (1000 + 2000) * 1% =') }} <em>30</em>
        </li>
        <li><strong>{{ tr('2. Comissão de B2') }}</strong> {{ tr('(sem subordinados) = (0+0) * 1% =') }} <em> 0</em></li>
        <li>
          <strong>{{ tr('3. Comissão B3') }}</strong> {{ tr('(contribuição direta de C3) = 20.000 * 3% =') }} <em>600</em>
        </li>
        <li>
          <strong
            >{{ tr('4. Além das contribuições dos subordinados diretos B1, B2 e B3, a comissão de A também advém das contribuições dos demais subordinados C1, C2 e C3, conforme segue:') }}
          </strong>
          <ul>
            <li>
              <strong>{{ tr('( 1 )Comissão direta de A') }}</strong>{{ tr('(contribuições diretas de B1, B2 e B3) = (500+3000+2000) * 3% =') }} <em>165</em>
            </li>
            <li>
              <strong>{{ tr('( 2) Outras comissões de A') }}</strong>{{ tr('(das contribuições C1, C2)=(1000+2000) * 2%=') }}
              <em>60</em>
            </li>
            <li><strong>{{ tr('(3)Comissão total de A') }} </strong>{{ tr('(direto + outro) = 165+60 =') }} <em>225</em></li>
          </ul>
        </li>
        <li>
          <strong>{{ tr('5. Resumo:') }} </strong>
          <ul>
            <li>
              <strong>{{ tr('(1) Equipe direta') }}</strong>{{ tr(': refere-se aos subordinados desenvolvidos diretamente por A, ou seja, o primeiro nível de relacionamento com A, denominados coletivamente como equipe direta.') }}
            </li>
            <li>
              <strong>{{ tr('(2) Outras equipes') }}</strong>{{ tr(': Refere-se àquelas que são desenvolvidas por subordinados de A. Possuem relacionamento de segundo nível com A ou superior, ou seja, subordinados de subordinados , e os subordinados dos subordinados.. etc., coletivamente referidos como outras equipes; como esse modelo de agência pode desenvolver subordinados ilimitados, para conveniência da explicação, este artigo toma apenas a estrutura de 2 níveis como exemplo.') }}
            </li>
            <li>
              <strong>{{ tr('(3) Descrição de A') }}</strong>{{ tr(': O desempenho direto de A é 5.500 e o outro desempenho é 20.000 (devido ao poder de C3). O desempenho total é 28.500 e a comissão correspondente a taxa é de 3%. Como B1 tem um desempenho total de 3.000 e desfruta de um desconto de apenas 1%, enquanto A tem um desempenho total de 28.500 e desfruta de uma taxa de desconto de 3%, então haverá uma diferença de desconto entre A e B1. A diferença é: 3% -1% =2%, essa diferença é a parte contribuída por C1 e C2 para A, então C1 e C2 contribuem para A: (1000+2000)* 2%=60, não há diferença extrema entre A e B3, então C3 contribui para A A comissão de contribuição é 0.') }}
            </li>
            <li>
              <strong>{{ tr('(4) Descrição de B1') }}</strong>{{ tr(': B1 tem subordinados C1 e C2. Como o desempenho direto é 3.000, o índice de desconto correspondente é de 1%.') }}
            </li>
            <li>
              <strong>{{ tr('(5) Explicação B2') }} </strong>{{ tr(': B2 pode ser preguiçoso e não se beneficiará se não desenvolver seus subordinados.') }}
            </li>
            <li>
              <strong>{{ tr('(6) Explicação B3') }}</strong>{{ tr(': Embora B3 tenha aderido relativamente tarde e seja subordinado de A, seu subordinado C3 é muito poderoso e tem um desempenho direto de 20.000, permitindo que B3 diretamente desfrutar de comissões mais elevadas.A proporção é de 3%.') }}
            </li>
            <li>
              <strong>{{ tr('(7) Resumo das regras') }}</strong>{{ tr(': Não importa quando você ingressa, de quem você é subordinado, não importa em que nível você está, sua renda nunca será afetada e você não sofre mais as perdas dos subordinados dos outros., o desenvolvimento não é restrito. Este é um modelo de agência absolutamente justo e imparcial, e ninguém estará sempre por baixo só porque entrou tarde.') }}
            </li>
          </ul>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
/* div.px-2 — the tab body is full-width here, unlike tab 1's inset scroller.
   The live scroller adds the 10px bottom gap; keeping it on the panel leaves
   tab 1's scroll extent untouched. */
.net {
  padding: 0 0.5rem 0.625rem;
}

/* ---- A-agent summary card ------------------------------------------------ */

.self {
  margin: 0.625rem;
  padding-bottom: 1rem;
  border: 0.0625rem solid rgb(42, 50, 78);
  border-radius: 0.625rem;
  font-size: 0.625rem;
  line-height: 0.9375rem;
  color: var(--color-text-100);
  text-align: center;
}

.self-row {
  display: flex;
  padding: 0.75rem 0.5rem;
  align-items: center;
}

.people {
  width: 3rem;
  height: 3rem;
  border: 0.0625rem solid var(--color-text-100);
  border-radius: 624.9375rem;
  background-color: var(--color-text-100);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.self-avatar {
  margin-left: 1.5rem;
  border-color: rgb(255, 170, 9);
}

/* The level badge hangs off the circle's bottom-right corner. */
.badge {
  position: relative;
  top: 2rem;
  left: 2rem;
  width: 1rem;
  height: 1rem;
  border-radius: 624.9375rem;
  font-size: 0.625rem;
  line-height: 1rem;
  color: var(--color-text-100);
  text-align: center;
}

.badge-a {
  background-color: rgb(255, 170, 9);
}

.self-list {
  width: 66.6667%;
  margin-left: 1rem;
  line-height: 1.25rem;
  text-align: left;
}

.self-list .line {
  display: inline-block;
  width: 100%;
}

/* The live figures keep <em>'s default italic. */
.money {
  color: rgb(251, 165, 49);
}

/* ---- Tree diagram -------------------------------------------------------- */

.tree {
  position: relative;
  padding: 0.5rem;
  margin-top: 0.5rem;
}

.arrow {
  position: absolute;
}

.arrow-lg {
  width: 17rem;
  height: 17rem;
}

.arrow-sm {
  width: 6rem;
  height: 6rem;
}

.arrow-c1-toa,
.arrow-c2-toa,
.arrow-c3-toa {
  width: 17rem;
  height: 17.40625rem;
  top: -0.00635rem;
}

.arrow-c2-toa {
  left: 5.60986rem;
}

.arrow-c1-toa {
  left: -6.6rem;
}

.arrow-c3-toa {
  left: 12.97463rem;
  transform: matrix(-1, 0, 0, 1, 0, 0);
}

.row-b {
  padding-top: 3.5rem;
}

.row-c {
  position: relative;
  z-index: 10;
  margin-top: 3.1rem;
}

/* ---- Callout chips ------------------------------------------------------- */

.chip {
  padding: 0.125rem;
  min-height: 1.25rem;
  border: 0.0625rem solid rgb(42, 50, 78);
  border-radius: 0.375rem;
  background-color: #101629;
  font-size: 0.6rem;
  line-height: 0.6rem;
  color: var(--color-text-100);
  text-align: center;
}

.chip-toa {
  position: absolute;
  z-index: 20;
  width: 6.3rem;
}

.chip-c1 {
  top: 1rem;
  left: 0.5rem;
}

.chip-c3 {
  top: 1rem;
  left: 17.07519rem;
}

.chip-c2 {
  top: -2.9rem;
  left: 12.77538rem;
  width: 6rem;
}

.node-chip {
  position: relative;
  width: 5.5rem;
  line-height: 1rem;
}

/* ---- Node rows ----------------------------------------------------------- */

.nodes {
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
}

.nodes-b {
  z-index: 10;
  margin-bottom: 0.25rem;
}

.agent-item {
  display: flex;
  width: 7rem;
  height: 7.5rem;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
}

.arrow-b1,
.arrow-b2,
.arrow-b3,
.arrow-c1-tob,
.arrow-c2-tob,
.arrow-c3-tob {
  width: 6rem;
  height: 6.40625rem;
}

.arrow-b1 {
  top: -4.00586rem;
  left: 2.2rem;
  transform: matrix(0.866025, 0.5, -0.5, 0.866025, 0, 0);
}

.arrow-b2 {
  top: -3.90625rem;
  left: 8.05469rem;
}

.arrow-b3 {
  top: -4.00586rem;
  left: 14.375rem;
  transform: matrix(0.866025, -0.5, 0.5, 0.866025, 0, 0);
}

.arrow-c1-tob {
  top: -2.70606rem;
  left: 0.5rem;
}

.arrow-c2-tob {
  top: -3.10596rem;
  left: 5.14599rem;
  transform: matrix(0.882948, -0.469472, 0.469472, 0.882948, 0, 0);
}

.arrow-c3-tob {
  top: -2.70606rem;
  left: 15.67531rem;
}

/* The avatar is centred on the box's top edge, nudged down 15% of itself. */
.valid {
  position: relative;
  width: 6.8rem;
  height: 4rem;
  padding-top: 1.8rem;
  border: 0.0625rem solid rgb(42, 50, 78);
  border-radius: 0.375rem;
  font-size: 0.625rem;
  line-height: 0.65rem;
}

.valid .people {
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translate(-50%, 15%);
}

.valid-text {
  color: var(--color-text-100);
}

/* ---- Tutorial article ---------------------------------------------------- */

.tutorial {
  padding: 0.4rem;
  border: 0.0625rem solid rgb(42, 50, 78);
  border-radius: 0.28rem;
  font-size: 0.6rem;
  line-height: 0.9rem;
  color: rgb(109, 120, 141);
}

.tutorial h1 {
  font-size: 0.7rem;
  font-weight: 500;
  line-height: 0.84rem;
}

.tutorial p {
  text-indent: 0.9rem;
}

.tutorial strong {
  font-weight: 700;
}

.tutorial ul {
  list-style: none;
}
</style>
