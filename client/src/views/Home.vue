<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-flex xs12>
        <v-img
          :src="require('../assets/pokeball.png')"
          class="my-3"
          contain
          height="200"
        ></v-img>
      </v-flex>

      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">
          Evenements
        </h1>
        <p class="subheading font-weight-regular">
          Voici les prochains Raid Ex, venez vous y inscrire:
        </p>
      </v-flex>
   </v-layout>

    <RaidExList />

  </v-container>
</template>

<script>
// @flow

import { Component, Vue } from 'vue-property-decorator';
import RaidExList from '../components/RaidExList.vue';

export default
@Component({
  components: {
    RaidExList,
  },
})
class Home extends Vue {
}
</script>
