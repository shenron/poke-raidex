<template>
  <RaidExList />
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
