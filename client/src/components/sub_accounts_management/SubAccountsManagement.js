// @flow

import { Component, Vue } from 'vue-property-decorator';
import VInputAvailableUser from '../input_available_user/VInputAvailableUser.vue';

export default
@Component({
  components: {
    VInputAvailableUser,
  },
})
class SubAccountsManagement extends Vue {
  newUser: string = '';

  get subAccounts() {
    return this.$store.state.user.accounts;
  }
}
