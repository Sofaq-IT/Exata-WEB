import { createRouter, createWebHistory } from 'vue-router';
import ApiService from '@/plugins/api';
import Dashboard from '../components/pages/Dashboard.vue';
import Login from '../components/pages/Login.vue';
import ForgotPass from '../components/pages/ForgotPass.vue';
import CodeVerification from '../components/pages/CodeVerification.vue';
import UpdatePass from '../components/pages/UpdatePass.vue';
import InternalLayout from '../components/pages/InternalLayout.vue';
import User from '../components/pages/user/User.vue';
import UserCadastro from '../components/pages/user/UserCadastro.vue';
import Customer from '../components/pages/customer/Customer.vue';
import CustomerCadastro from '../components/pages/customer/CustomerCadastro.vue';

const routes = [
  { path: '/login', component: Login, meta: { requiresAuth: false } },
  { path: '/esqueciMinhaSenha', component: ForgotPass, meta: { requiresAuth: false } },
  { path: '/verificacaoCodigo', component: CodeVerification, meta: { requiresAuth: false } },
  { path: '/cadastroSenha', component: UpdatePass, meta: { requiresAuth: false } },
  {
    path: '/interno',
    component: InternalLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
      { path: 'usuario', component: User, meta: { requiresAuth: true } },
      { path: 'usuario/cadastro/:id?', component: UserCadastro, meta: { requiresAuth: true } },
      { path: 'cliente', component: Customer },
      { path: 'cliente/cadastro/:id?', component: CustomerCadastro, meta: { requiresAuth: true } },
    ],
  },
  // Redirect root to login
  { path: '/', redirect: '/login' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  // Verificar se a rota requer autenticação
  if (to.meta.requiresAuth) {
    // Verificar se o usuário está autenticado
    const isAuthenticated = await ApiService.isAuthenticated();
    if (isAuthenticated) {
      // Permitir o acesso à rota protegida
      next();
    } else {
      // Redirecionar para a página de login se não estiver autenticado
      next('/login');
    }
  } else {
    // Se a rota não requer autenticação, permitir o acesso diretamente
    next();
  }
});

export default router;
