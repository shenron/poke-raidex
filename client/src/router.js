import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/home/Home.vue';
import Login from './views/login/Login.vue';
import Registration from './views/registration/Registration.vue';
import Admin from './views/admin/Admin.vue';
import AdminCalendar from './views/admin_calendar/AdminCalendar.vue';
import AdminUsersManagement from './views/admin_users_management/AdminUsersManagement.vue';
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
      path: '/registration',
      name: 'registration',
      meta: { unsecure: true },
      component: Registration,
    },
    {
      path: '/admin',
      component: Admin,
      children: [{
        path: '',
        name: 'admin',
        component: AdminCalendar,
      }, {
        path: 'users',
        name: 'admin-users-management',
        component: AdminUsersManagement,
      }],
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
