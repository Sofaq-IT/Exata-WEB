import { createRouter, createWebHistory } from 'vue-router';
import ApiService from '@/plugins/api';
import Dashboard from '../components/pages/Dashboard.vue';
import Login from '../components/pages/Login.vue';
import InternalLayout from '../components/pages/InternalLayout.vue';
import Profile from '../components/pages/profile/Profile.vue';
import ProfileCadastro from '../components/pages/profile/ProfileCadastro.vue';
import ProfilePermission from '../components/pages/profile/ProfilePermission.vue';
import User from '../components/pages/user/User.vue';
import UserCadastro from '../components/pages/user/UserCadastro.vue';
import Section from '../components/pages/section/Section.vue';
import SectionCadastro from '../components/pages/section/SectionCadastro.vue';
import Phone from '../components/pages/phone/Phone.vue';
import PhoneCadastro from '../components/pages/phone/PhoneCadastro.vue';
import ContactType from '../components/pages/contactType/ContactType.vue';
import ContactTypeCadastro from '../components/pages/contactType/ContactTypeCadastro.vue';
import Contact from '../components/pages/contact/Contact.vue';
import ContactCadastro from '../components/pages/contact/ContactCadastro.vue';
import ContactTypeVinculo from '../components/pages/contact/ContactType.vue';
import Chat from '../components/pages/chat/Chat.vue';
import License from '../components/pages/license/License.vue';

const routes = [
  { path: '/login', component: Login, meta: { requiresAuth: false } },
  {
    path: '/interno',
    component: InternalLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
      { path: 'usuario', component: User, meta: { requiresAuth: true } },
      { path: 'usuario/cadastro/:id?', component: UserCadastro, meta: { requiresAuth: true } },
      { path: 'perfil', component: Profile },
      { path: 'perfil/cadastro/:id?', component: ProfileCadastro, meta: { requiresAuth: true } },
      { path: 'perfil/permissoes/:id?', component: ProfilePermission, meta: { requiresAuth: true } },
      { path: 'secao', component: Section },
      { path: 'secao/cadastro/:id?', component: SectionCadastro, meta: { requiresAuth: true } },
      { path: 'telefone', component: Phone },
      { path: 'telefone/cadastro/:id?', component: PhoneCadastro, meta: { requiresAuth: true } },
      { path: 'tipoContato', component: ContactType },
      { path: 'tipoContato/cadastro/:id?', component: ContactTypeCadastro, meta: { requiresAuth: true } },
      { path: 'contato', component: Contact },
      { path: 'contato/cadastro/:id?', component: ContactCadastro, meta: { requiresAuth: true } },
      { path: 'contato/tipo/:id?', component: ContactTypeVinculo, meta: { requiresAuth: true } },
      { path: 'chat', component: Chat, meta: { requiresAuth: true } },
      { path: 'contratante', component: License, meta: { requiresAuth: true } },
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
