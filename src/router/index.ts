import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import InicioPage from '../views/InicioPage.vue'
import PerfilPage from '../views/PerfilPage.vue'
import ConvidarPage from '../views/perfil/ConvidarPage.vue'
import ReportPage from '../views/perfil/ReportPage.vue'
import PromoPage from '../views/PromoPage.vue'
import NotificationPage from '../views/perfil/NotificationPage.vue'
import SecurityPage from '../views/perfil/SecurityPage.vue'
import SecurityVerifyPage from '../views/perfil/SecurityVerifyPage.vue'
import SecurityBindPage from '../views/perfil/SecurityBindPage.vue'
import SecurityConfirmPage from '../views/perfil/SecurityConfirmPage.vue'
import ActivityVipPage from '../views/perfil/ActivityVipPage.vue'
import ActivityDetailPage from '../views/ActivityDetailPage.vue'
import RebateRecordPage from '../views/RebateRecordPage.vue'
import EntrarPage from '../views/EntrarPage.vue'
import GameSearchPage from '../views/GameSearchPage.vue'
import GameActionPage from '../views/GameActionPage.vue'
import GameCategoryPage from '../views/GameCategoryPage.vue'
import WithdrawPage from '../views/WithdrawPage.vue'
import WithdrawApplyPage from '../views/WithdrawApplyPage.vue'
import WithdrawSubViewPage from '../views/WithdrawSubViewPage.vue'
import RechargeRecordPage from '../views/RechargeRecordPage.vue'
import WithdrawalAccountPage from '../views/WithdrawalAccountPage.vue'
import WithdrawalBindPage from '../views/WithdrawalBindPage.vue'
import { stickyInvite } from '../utils/inviteCode'

// The catch-all sends unknown paths home, so every real route has to be
// declared above it or it would be swallowed.
const routes: RouteRecordRaw[] = [
  { path: '/', redirect: (to) => ({ path: '/main/inicio', query: to.query, hash: to.hash }) },
  { path: '/main/inicio', name: 'inicio', component: InicioPage },
  { path: '/main/promo', name: 'promo', component: PromoPage },
  { path: '/main/entrar', name: 'entrar', component: EntrarPage },
  { path: '/main/perfil', name: 'perfil', component: PerfilPage },
  // Perfil -> Relatórios; the live site keeps this one outside /main.
  { path: '/user/report', name: 'user-report', component: ReportPage },
  // Perfil -> Convidar, "ConvidarCentro" on the live site.
  { path: '/spread', name: 'spread', component: ConvidarPage },
  // Perfil -> Suporte, "Centro de Mensagens" on the live site.
  { path: '/notification', name: 'notification', component: NotificationPage },
  // Perfil -> Centro de Segurança.
  { path: '/security', name: 'security', component: SecurityPage },
  // Centro de Segurança -> Senha de Login / Senha de Ativos / E-mail verify.
  { path: '/security/verify/password', name: 'security-verify-password', component: SecurityVerifyPage },
  { path: '/security/verify/asset', name: 'security-verify-asset', component: SecurityVerifyPage },
  { path: '/security/verify/email', name: 'security-verify-email', component: SecurityVerifyPage },
  { path: '/security/bind/:type', name: 'security-bind', component: SecurityBindPage },
  { path: '/security/confirm/:type', name: 'security-confirm', component: SecurityConfirmPage },
  // Perfil Aposta / VIP card. Same VipPanel as /main/promo's VIP tab.
  { path: '/activity/vip', name: 'activity-vip', component: ActivityVipPage },
  // Rebate panel Histórico. Must sit above `/activity/:type/:id`.
  { path: '/activity/rebate/record', name: 'activity-rebate-record', component: RebateRecordPage },
  // Eventos cards. Live first card is /activity/Assistance/3734@style_0.
  { path: '/activity/:type/:id', name: 'activity-detail', component: ActivityDetailPage },
  // Homepage header magnifier. Live pathname is /game/search/:provider.
  { path: '/game/search/:provider?', name: 'game-search', component: GameSearchPage },
  { path: '/game/action/:id', name: 'game-action', component: GameActionPage },
  { path: '/game/category/:gameType/:platformId?', name: 'game-category', component: GameCategoryPage },
  // Homepage TabBar Saque. Live pathname is /main/withdraw.
  { path: '/main/withdraw', name: 'withdraw', component: WithdrawPage },
  // Retirar Agora after fund password is set. Live meta hasBottomTab:false.
  { path: '/withdraw/apply', name: 'withdraw-apply', component: WithdrawApplyPage },
  // PIX chip on the Saque form.
  { path: '/withdrawalAccount', name: 'withdrawal-account', component: WithdrawalAccountPage },
  { path: '/withdrawalBindAccount', name: 'withdrawal-bind', component: WithdrawalBindPage },
  // Saque header record icon. Live pathname is /withdrawSubView, not /withdrawRecord.
  { path: '/withdrawSubView', name: 'withdraw-sub-view', component: WithdrawSubViewPage },
  // Depósito header record icon. Live pathname is /rechargeRecord.
  { path: '/rechargeRecord', name: 'recharge-record', component: RechargeRecordPage },
  {
    path: '/:pathMatch(.*)*',
    redirect: (to) => ({ path: '/main/inicio', query: to.query, hash: to.hash }),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const code = stickyInvite()
  if (!code) return
  const current = Array.isArray(to.query.inviteCode) ? to.query.inviteCode[0] : to.query.inviteCode
  if (current === code) return
  return {
    path: to.path,
    params: to.params,
    query: { ...to.query, inviteCode: code },
    hash: to.hash,
    replace: true,
  }
})
