// @flow

import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import api from '@/api/raidex';
import monthNames from '@/_base/monthNames';
import type { UserStateType } from '@/store/modules/user';
import type { IdLabelType } from '@/definitions/IdLabel.d';

type UserEventType = {|
  accountId: string,
  teamId: string,
|};

const { getRaidEx } = api;

export default
@Component
class ConfirmSubscription extends Vue {
  // toggle the dialog to unsubscribe
  leaveDialog: boolean = false;

  // toggle the dialog to save
  savedModal: boolean = false;

  // model new account, it will be pused in the list of `accountLists`
  newAccount: string = '';

  // accounts available for the connected user
  accountList: Array<IdLabelType> = [];

  // saved raid ex - users
  users: Array<{
    id: string,
    user: string,
    subscriptions: Array<{| userId: string, teamId: string |}>,
    teamId: string,
  }> = [];


  userEvents: Array<UserEventType> = [];

  // saved raid ex - start
  start: ?string = null;

  // saved raid ex - end
  end: ?string = null;

  // saved raid ex - area id
  areaId: ?string = null;

  /**
   * It's not possible to have dupplicate team
   */
  getDistinctTeams(userEvent: UserEventType): Array<IdLabelType> {
    // from `teams` substract already used team from `userEvents`
    // ignore current userEvent
    return this.teams
      .filter(
        team => !this.userEvents
          .filter(_userEvent => _userEvent !== userEvent)
          .find(_userEvent => _userEvent.teamId === team.id),
      );
  }

  getDistinctAccounts(userEvent: UserEventType): Array<IdLabelType> {
    // from `accountList` substract already used team from `userEvents`
    // ignore current userEvent
    return this.accountList
      .filter(
        account => !this.userEvents
          .filter(_userEvent => _userEvent !== userEvent)
          .find(_userEvent => _userEvent.accountId === account.id),
      );
  }

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
    return this.users.reduce((a, b) => a + b.subscriptions.length, 0);
  }

  get isValidForm() {
    return false;
  }

  async created() {
    const { data } = await getRaidEx(this.id);

    this.users = data.users;
    this.start = data.start;
    this.end = data.end;
    this.areaId = data.areaId;
    this.userEvents.push({ accountId: this.userStore.id, teamId: '' });
  }

  @Watch('userEvents', { deep: true })
  onUserEventsChanged(userEvents: Array<UserEventType>) {
    if (!userEvents.length) {
      return;
    }

    const lastUserEvent = userEvents[userEvents.length - 1];
    if (lastUserEvent.accountId && lastUserEvent.teamId) {
      userEvents.push({ accountId: '', teamId: '' });
    }
  }

  @Watch('$store.state.user', { deep: true, immediate: true })
  onStoreUserChanged(user?: UserStateType) {
    if (user && user.id) {
      this.accountList = [{
        id: user.id,
        label: user.user,
      },
      ...(user.accounts || []),
      ];
    }
  }

  editSubscription() {
    this.savedModal = false;

    // update
    // if (this.isSubscribed) {
    //   const { currentAccount } = this;
    //   const pos = this.users.indexOf(currentAccount);

    //   if (currentAccount && pos > -1) {
    //     this.users.splice(pos, 1, {
    //       id: currentAccount.id,
    //       user: currentAccount.user,
    //       accountIds: this.accountIds,
    //       teamId: String(this.teamId),
    //     });
    //   }
    // } else {
    //   // create
    //   this.users.push({
    //     id: this.$store.state.user.id,
    //     user: this.$store.state.user.user,
    //     accountIds: this.accountIds,
    //     teamId: String(this.teamId),
    //   });
    // }
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

  applyNewSubAccount() {
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
