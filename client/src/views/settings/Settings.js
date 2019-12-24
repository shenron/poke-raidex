// @flow

import { Component, Vue, Watch } from 'vue-property-decorator';
import SubAccountsManagement from '@/components/sub_accounts_management/SubAccountsManagement.vue';

export default
@Component({
  components: {
    SubAccountsManagement,
  },
})
class Settings extends Vue {
  activeBtn: string = 'SETTINGS';

  @Watch('activeBtn')
  onActiveBtnChanged(activeBtn: string) {
    this.$router.push({ name: activeBtn.toLowerCase() });
  }
}
