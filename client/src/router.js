import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/home/Home.vue';
import Login from './views/login/Login.vue';
import Inscription from './views/inscription/Inscription.vue';
import Admin from './views/admin/Admin.vue';
import Event from './views/event/Event.vue';
import Settings from './views/settings/Settings.vue';
import store from './store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/event/:id',
      name: 'event',
      component: Event,
      props: (route) => ({ id: route.params.id }),
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
    {
      path: '/login',
      name: 'login',
      meta: { unsecure: true },
      component: Login,
    },
    {
      path: '/inscription',
      name: 'inscription',
      meta: { unsecure: true },
      component: Inscription,
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => !record.meta.unsecure) && !store.state.user.id) {
    return router.push({ name: 'login' });
  }
  return next();
});

export default router;
