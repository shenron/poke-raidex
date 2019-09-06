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

   <v-layout row>
     <v-flex xs12 md4 v-for="i in 3" :key="i">
      <div class="ma-2 mb-10">
        <RaidEx :key="i" :id="i" />
      </div>
     </v-flex>
   </v-layout>
  </v-container>
</template>

<script>
// @flow

import { Component, Vue } from 'vue-property-decorator';
import RaidEx from '@/components/RaidEx.vue';

export default
@Component({
  components: {
    RaidEx,
  },
})
class RaidExList extends Vue {
}
</script>
