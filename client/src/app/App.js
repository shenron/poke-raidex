// @flow

import { Component, Vue, Watch } from 'vue-property-decorator';
import userApi from '@/api/user';
import type { UserStateType } from '@/store/modules/user';

export default
@Component
class App extends Vue {
  get user() {
    return this.$store.state.user;
  }

  @Watch('user', { deep: true, immediate: true })
  async onUserConnected(user: UserStateType) {
    if (user.id) {
      try {
        await userApi.testSession();

        await Promise.all([
          this.$store.dispatch('raidex/getAreas'),
          this.$store.dispatch('raidex/getTeams'),
          this.$store.dispatch('raidex/getTypes'),
        ]);

        this.$store.dispatch('raidex/getRaidEx');
      } catch (e) {
        this.logOff();
      }
    }
  }

  async logOff() {
    await this.$store.dispatch('user/logOff');
    this.$router.push({ name: 'login' });
  }
}
