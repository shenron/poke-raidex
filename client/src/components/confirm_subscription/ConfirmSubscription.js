// @flow

import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import api from '@/api/raidex';
import monthNames from '@/_base/monthNames';
import type { UserStateType } from '@/store/modules/user';

const { getRaidEx } = api;

export default
@Component
class ConfirmSubscription extends Vue {
  leaveDialog: boolean = false;

  savedModal: boolean = false;

  // model team
  teamId: ?number = null;

  // model sub accounts
  accountIds: Array<string> = [];

  // model new account
  newAccount: string = '';

  // accounts available
  accountList: Array<{ id: string, label: string }> = [];

  // saved raid ex - users
  users: Array<{
    id: string,
    user: string,
    accountIds: Array<string>,
    teamId: string,
  }> = [];

  // saved raid ex - start
  start: ?string = null;

  // saved raid ex - end
  end: ?string = null;

  // saved raid ex - area id
  areaId: ?string = null;

  get areas() {
    return this.$store.state.raidex.areas;
  }

  get teams() {
    return this.$store.state.raidex.teams;
  }

  get areaLabel() {
    const area = this.areas.find(_area => _area.id === this.areaId);
    return area ? area.label : '';
  }

  // user changes something, need to save
  get hasBeenChanged() {
    return true;
  }

  get userStore() {
    return this.$store.state.user;
  }

  /**
   * Current account from saved raid ex
   */
  get currentAccount() {
    return this.users.find(user => user.id === this.$store.state.user.id);
  }

  get isSubscribed() {
    return !!this.currentAccount;
  }

  get dateStr() {
    if (!this.start || !this.end) {
      return '';
    }

    let str = 'Du ';

    const dateStart = new Date(this.start);
    str += ` ${dateStart.getDate()}`;

    if (this.end) {
      const dateEnd = new Date(this.end);

      if (dateStart.getMonth() !== dateEnd.getMonth()) {
        str += `${monthNames[dateStart.getMonth()]}`;
      }

      str += ` au ${dateEnd.getDate()} ${monthNames[dateEnd.getMonth()]}`;
    }

    return str;
  }

  get usersLength() {
    return this.users.reduce((a, b) => a + b.accountIds.length, 0);
  }

  get isValidForm() {
    return this.teamId !== null && this.accountIds.length > 0;
  }

  async created() {
    const { data } = await getRaidEx(this.id);

    this.users = data.users;
    this.start = data.start;
    this.end = data.end;
    this.areaId = data.areaId;
  }

  @Watch('currentAccount', { deep: true })
  onCurrentAccountChanged(currentAccount?: { id: string, accountIds: Array<string>, teamId: number }) {
    if (currentAccount) {
      this.accountIds = currentAccount.accountIds;
      this.teamId = currentAccount.teamId;
    }
  }

  @Watch('$store.state.user', { deep: true, immediate: true })
  onStoreUserChanged(user?: UserStateType) {
    if (user) {
      this.accountList = [...(user.accounts || [])];
    }
  }

  editSubscription() {
    this.savedModal = false;

    // update
    if (this.isSubscribed) {
      const { currentAccount } = this;
      const pos = this.users.indexOf(currentAccount);

      if (currentAccount && pos > -1) {
        this.users.splice(pos, 1, {
          id: currentAccount.id,
          user: currentAccount.user,
          accountIds: this.accountIds,
          teamId: String(this.teamId),
        });
      }
    } else {
      // create
      this.users.push({
        id: this.$store.state.user.id,
        user: this.$store.state.user.user,
        accountIds: this.accountIds,
        teamId: String(this.teamId),
      });
    }
  }

  unsubscribe() {
    this.leaveDialog = false;

    this.teamId = null;
    this.accountIds = [];

    const { currentAccount } = this;
    const pos = this.users.indexOf(currentAccount);

    if (pos > -1) {
      this.users.splice(pos, 1);
    }
  }

  applyNewCompte() {
    // fake id,
    const id = String(Math.floor(Math.random() * (100 - 20 + 1) + 20));
    const newAccount = {
      id,
      label: this.newAccount,
    };
    this.accountList.push(newAccount);
    this.accountIds.push(newAccount.id);
    this.newAccount = '';

    this.$store.commit('user/setAccounts', this.accountList);
  }

  removeAccount(id: string) {
    // remove from selected
    let pos = this.accountIds.findIndex(accountId => accountId === id);
    if (pos > -1) {
      this.accountIds.splice(pos, 1);
    }

    // remove from the available list
    pos = this.accountList.findIndex(account => account.id === id);
    this.accountList.splice(pos, 1);

    this.$store.commit('user/setAccounts', this.accountList);
  }

  @Prop({ type: String, required: true })
  id: string;
}
