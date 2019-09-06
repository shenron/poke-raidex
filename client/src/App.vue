<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Poke RaidEx </span>
        <span class="font-weight-light">C'est parti!</span>
      </v-toolbar-title>
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
  data() {
    return {};
  }
}
</script>

<style lang="scss">
main {
  background-color: #fff;
  background-image: url('~/bg-kyurem.jpg');
  background-position: right bottom;
  background-repeat: no-repeat;
  background-size:  20%;
}
</style>
