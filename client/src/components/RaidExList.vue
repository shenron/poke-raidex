<template>
  <v-layout row>
    <v-flex xs12 md4 v-for="i in 3" :key="i">
     <div class="ma-2 mb-10">
       <RaidEx :key="i" :id="i" />
     </div>
    </v-flex>
  </v-layout>
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
