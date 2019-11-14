// @flow

import { Component, Vue } from 'vue-property-decorator';

export default
@Component
class App extends Vue {
  created() {
    this.$store.dispatch('raidex/getAreas');
    this.$store.dispatch('raidex/getTeams');
    this.$store.dispatch('raidex/getTypes');
    this.$store.dispatch('raidex/getEvents');
  }

  get user() {
    return this.$store.state.user;
  }

  async logOff() {
    await this.$store.dispatch('user/logOff');
    this.$router.push({ name: 'login' });
  }
}
