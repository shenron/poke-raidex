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

  // newUser error
  error: string = '';

  dialogDelete: boolean = false;

  get isValid() {
    return !this.error && this.newUser.length >= 3;
  }

  get subAccounts() {
    return this.$store.state.user.accounts;
  }

  async addAccount() {
    await this.$store.dispatch('user/addAccount', this.newUser);
    this.newUser = '';
  }

  deleteAccount(userId: string) {
    return this.$store.dispatch('user/deleteAccount', userId);
  }

  closeDeleteDialog() {
    this.dialogDelete = false;
  }
}
