<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Poke RaidEx </span>
        <span class="font-weight-light">C'est parti!</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu v-if="$store.state.user.id" offset-y>
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark v-on="on">
            {{ $store.state.user.user }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-if="$store.state.user.type === 'ADMIN'"
            @click="$router.push({ name: 'admin' })"
          >
            <v-list-item-title>Admin</v-list-item-title>
          </v-list-item>

          <v-list-item @click="$store.commit('user/logoff')">
            <v-list-item-title>Déconnexion</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content class="mt-3">
      <router-view :key="$route.fullPath"></router-view>
    </v-content>
  </v-app>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator';
import type { UserSateType } from '@/store/modules/user';

export default
@Component
class App extends Vue {
  @Watch('$store.state.user', { deep: true })
  onUserStateChanged(user: UserSateType) {
    if (user.id) {
      this.$router.push({ name: 'home' });
    } else {
      this.$router.push({ name: 'login' });
    }
  }
}
</script>

<style lang="scss">
main {
  background-color: #fff;
  background-image: url("~/bg-kyurem.jpg");
  background-position: right bottom;
  background-repeat: no-repeat;
  background-size: 20%;
}
</style>
