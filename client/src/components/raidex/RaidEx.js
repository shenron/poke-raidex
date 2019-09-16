// @flow

import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import api from '@/api/raidex';
import monthNames from '@/_base/monthNames';

const { getRaidEx } = api;

export default
@Component
class RaidEx extends Vue {
  leaveDialog: boolean = false;

  savedModal: boolean = false;

  // model team
  teamId: ?number = null;

  get teamColor() {
    if (!this.teamId) {
      return '';
    }

    const team = this.teams.find(_team => _team.id === this.teamId);
    if (!team) {
      return '';
    }

    return team.color;
  }

  // model sub accounts
  accountIds: Array<string> = [];

  // model new account
  newAccount: string = '';

  // model account to remove
  accountToRemove: string = '';

  // model - account list
  accountList: Array<{ id: string, label: string }> = [];

  isExtandedMenuDisplayed: boolean = false;

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
    const user = this.currentAccount;
    if (!user) {
      return false;
    }

    return JSON.stringify(user.accountIds) !== JSON.stringify(this.accountIds) || user.teamId !== this.teamId;
  }

  /**
   * Current account from saved raid ex
   */
  get currentAccount() {
    return this.users.find(user => user.id === this.$store.state.user.id);
  }

  get color() {
    let color = '';
    switch (this.teamId) {
      case 1: {
        color = 'red';
        break;
      }
      case 2: {
        color = 'blue';
        break;
      }
      case 3: {
        color = 'yellow';
        break;
      }
      default: {
        color = '';
      }
    }
    return color;
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
    return this.users.reduce((a, b) => a + b.accountIds.length, this.users.length);
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

    this.accountList = [...this.$store.state.user.accounts];
  }

  @Watch('currentAccount', { deep: true })
  onCurrentAccountChanged(currentAccount?: { id: string, accountIds: Array<string>, teamId: number }) {
    if (currentAccount) {
      this.accountIds = currentAccount.accountIds;
      this.teamId = currentAccount.teamId;
    }
  }

  editSubscription() {
    this.savedModal = false;

    // update
    if (this.isSubscribed) {
      //
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

  onCloseManageAccount() {
    this.isExtandedMenuDisplayed = false;
    this.$refs.accountsSelect.blur();
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
  }

  removeAccount() {
    const accLower = this.accountToRemove.toLowerCase();

    const { id } = this.accountList.find(account => account.label.toLowerCase() === accLower) || {};
    if (!id) {
      return;
    }

    // remove from selected
    let pos = this.accountIds.findIndex(accountId => accountId === id);
    if (pos > -1) {
      this.accountIds.splice(pos, 1);
    }

    // remove from the available list
    pos = this.accountList.findIndex(account => account.id === id);
    this.accountList.splice(pos, 1);

    this.accountToRemove = '';
  }

  @Prop({ type: String, required: true })
  id: string;
}
