import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Admin from './views/Admin.vue';
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
      path: '/login',
      name: 'login',
      meta: { unsecure: true },
      component: Login,
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => !record.meta.unsecure) && !store.getters['user/user'].id) {
    return router.push({ name: 'login' });
  }
  return next();
});

export default router;
