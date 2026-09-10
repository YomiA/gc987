import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import InicioPage from '../views/InicioPage.vue'
import PerfilPage from '../views/PerfilPage.vue'
import ConvidarPage from '../views/perfil/ConvidarPage.vue'
import ReportPage from '../views/perfil/ReportPage.vue'
import PromoPage from '../views/PromoPage.vue'
import NotificationPage from '../views/perfil/NotificationPage.vue'
import SecurityPage from '../views/perfil/SecurityPage.vue'
import SecurityVerifyPage from '../views/perfil/SecurityVerifyPage.vue'
import ActivityVipPage from '../views/perfil/ActivityVipPage.vue'
import EntrarPage from '../views/EntrarPage.vue'

// The catch-all sends unknown paths home, so every real route has to be
// declared above it or it would be swallowed.
const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/main/inicio' },
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
  // Centro de Segurança -> Senha de Login / Senha de Ativos (first page only).
  { path: '/security/verify/password', name: 'security-verify-password', component: SecurityVerifyPage },
  { path: '/security/verify/asset', name: 'security-verify-asset', component: SecurityVerifyPage },
  // Perfil Aposta / VIP card. Same VipPanel as /main/promo's VIP tab.
  { path: '/activity/vip', name: 'activity-vip', component: ActivityVipPage },
  { path: '/:pathMatch(.*)*', redirect: '/main/inicio' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
