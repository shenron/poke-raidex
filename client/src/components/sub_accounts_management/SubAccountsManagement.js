// @flow

import { Component, Vue, Watch } from 'vue-property-decorator';
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

  subAccounts: Array<{| id: string, label: string |}> = [];

  get isValid() {
    return !this.error && this.newUser.length >= 3;
  }

  @Watch('$store.state.user.accounts', { immediate: true })
  onSubAccountsChanged(subAccounts: Array<{| id: string, label: string |}>) {
    this.subAccounts = subAccounts.concat().map((user) => ({
      ...user,
    }));
  }

  async addAccount() {
    await this.$store.dispatch('user/addAccount', this.newUser);
    this.newUser = '';
  }

  deleteAccount(userId: string) {
    return this.$store.dispatch('user/deleteAccount', userId);
  }

  updateAccount(id: string, user: string) {
    return this.$store.dispatch('user/updateAccount', {
      id,
      user,
    });
  }

  closeDeleteDialog() {
    this.dialogDelete = false;
  }
}
