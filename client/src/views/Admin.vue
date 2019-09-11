<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-flex xs12 class="core-goto">
        <v-img
          :src="require('../assets/pokemon_center.png')"
          class="my-3"
          contain
          height="164"
        ></v-img>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// flow

import { Component, Vue } from 'vue-property-decorator';

export default
@Component
class Admin extends Vue {

}
</script>
