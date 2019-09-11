<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Poke RaidEx </span>
        <span class="font-weight-light">C'est parti!</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn-toggle v-if="user.id">
        <v-btn v-if="$route.name !== 'home'" color="primary" @click="$router.push({ name: 'home' })" dark>Accueil</v-btn>

        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark v-on="on">
              {{ user.user }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-if=" user.type === 'ADMIN'"
              @click="$router.push({ name: 'admin' })"
              :disabled="$route.name === 'admin'"
            >
              <v-list-item-title>Admin</v-list-item-title>
            </v-list-item>

            <v-list-item @click="logOff">
              <v-list-item-title>Déconnexion</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn-toggle>
    </v-app-bar>

    <v-content class="mt-3">
      <router-view :key="$route.fullPath"></router-view>
    </v-content>
  </v-app>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

export default
@Component
class App extends Vue {
  get user() {
    return this.$store.state.user;
  }

  async logOff() {
    await this.$store.dispatch('user/logOff');
    this.$router.push({ name: 'login' });
  }
}
</script>

<style lang="scss">
main {
  background-color: #fff;
  background-image: url('~/bg-kyurem.jpg');
  background-position: right bottom;
  background-repeat: no-repeat;
  background-size: 20%;
}
</style>
