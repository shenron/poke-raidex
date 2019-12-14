// @flow

import { Component, Watch, Vue } from 'vue-property-decorator';

export default
@Component
class Admin extends Vue {
  activeBtn: string = 'ADMIN';

  @Watch('activeBtn')
  onActiveBtnChanged(activeBtn: string) {
    this.$router.push({ name: activeBtn.toLowerCase() });
  }
}
