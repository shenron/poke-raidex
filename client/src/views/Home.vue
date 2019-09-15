<template>
  <v-container>
    <v-layout text-center wrap>
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
      <v-flex xs12 md4 v-for="raidExId in raidExList" :key="raidExId">
        <div class="ma-2 mb-10">
          <RaidEx :key="raidExId" :id="raidExId" />
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// @flow

import { Component, Vue } from 'vue-property-decorator';
import api from '@/api/raidex';
import RaidEx from '@/components/raidex/RaidEx.vue';

const { getRaidExList } = api;

export default
@Component({
  components: {
    RaidEx,
  },
})
class Home extends Vue {
  raidExList: Array<string> = [];

  async created() {
    const { data } = await getRaidExList();

    this.raidExList = data;
  }
}
</script>
