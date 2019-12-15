// @flow

import { Component, Vue, Watch } from 'vue-property-decorator';

export default
@Component
class Settings extends Vue {
  activeBtn: string = 'SETTINGS';

  @Watch('activeBtn')
  onActiveBtnChanged(activeBtn: string) {
    this.$router.push({ name: activeBtn.toLowerCase() });
  }
}
