// @flow

import { Component, Vue } from 'vue-property-decorator';
import userApi from '@/api/user';

export default
@Component
class App extends Vue {
  async created() {
    try {
      await userApi.testSession();

      this.$store.dispatch('raidex/getAreas');
      this.$store.dispatch('raidex/getTeams');
      this.$store.dispatch('raidex/getTypes');
      this.$store.dispatch('raidex/getEvents');
    } catch (e) {
      this.logOff();
    }
  }

  get user() {
    return this.$store.state.user;
  }

  async logOff() {
    await this.$store.dispatch('user/logOff');
    this.$router.push({ name: 'login' });
  }
}
