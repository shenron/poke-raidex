// @flow

import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import api, { type RaidExUserType } from '@/api/raidex';
import monthNames from '@/_base/monthNames';
import type { UserStateType } from '@/store/modules/user';
import type { IdLabelType } from '@/definitions/IdLabel.d';

type UserEventType = {|
  userId: string,
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
  freeAccount: string = '';

  // model team of new account, it will be pused in the list of `accountLists`
  freeAccountTeamId: string = '';

  // accounts available for the connected user
  accountList: Array<IdLabelType> = [];

  // saved raid ex - users
  users: Array<RaidExUserType> = [];

  userEvents: Array<UserEventType> = [];

  // saved raid ex - start
  start: ?string = null;

  // saved raid ex - end
  end: ?string = null;

  // saved raid ex - area id
  areaId: ?string = null;

  /**
   * Accounts subscribed to the event
   */
  get myAccounts() {
    const myId = this.$store.state.user.id;

    const me = this.users
      .find((user) => user.id === myId);

    if (me) {
      return me.subscriptions;
    }

    return [];
  }

  getDistinctAccounts(userEvent: UserEventType): Array<IdLabelType> {
    // from `accountList` substract already used team from `userEvents`
    // ignore current userEvent
    return this.accountList
      .filter(
        (account) => !this.userEvents
          .filter((_userEvent) => _userEvent !== userEvent)
          .find((_userEvent) => _userEvent.userId === account.id),
      );
  }

  removeUserEvent(i: number) {
    if (this.userEvents.length === 1) {
      this.userEvents[0].userId = '';
      this.userEvents[0].teamId = '';
    } else {
      this.userEvents.splice(i, 1);
    }
  }

  get areas() {
    return this.$store.state.raidex.areas;
  }

  get teams() {
    return this.$store.state.raidex.teams;
  }

  get areaLabel() {
    const area = this.areas.find((_area) => _area.id === this.areaId);
    return area ? area.label : '';
  }

  // user changes something, need to save
  get hasBeenChanged() {
    return true;
  }

  get userStore() {
    return this.$store.state.user;
  }

  get dateStr() {
    if (!this.start || !this.end) {
      return '';
    }

    let str = 'Du ';

    const dateStart = new Date(this.start);
    str += ` ${dateStart.getDate()} `;

    if (this.end) {
      const dateEnd = new Date(this.end);

      if (dateStart.getMonth() !== dateEnd.getMonth()) {
        str += `${monthNames[dateStart.getMonth()]}`;
      }

      str += ` au ${dateEnd.getDate()} ${monthNames[dateEnd.getMonth()]}`;
    }

    return str;
  }

  get isValidForm() {
    return !!this.userEvents.find((userEvent) => userEvent.userId && userEvent.teamId);
  }

  get freeUserEvent(): UserEventType {
    return {
      userId: this.freeAccount,
      teamId: this.freeAccountTeamId,
    };
  }

  async created() {
    const { data } = await getRaidEx(this.id);

    this.users = data.users;
    this.start = data.start;
    this.end = data.end;
    this.areaId = data.areaId;

    this.userEvents = this.myAccounts.map((user) => ({
      userId: user.userId,
      teamId: user.teamId,
    }));

    if (!this.userEvents.length) {
      this.userEvents.push({ userId: this.userStore.id, teamId: '' });
    }
  }

  @Watch('freeUserEvent')
  async onWatchNewAccountChanged(freeAccount: UserEventType) {
    if (freeAccount.userId && freeAccount.teamId) {
      const newAccount = await this.createSubAccount(freeAccount.userId);
      this.userEvents.splice(this.userEvents.length - 1, 1, {
        userId: newAccount.id,
        teamId: freeAccount.teamId,
      });

      this.freeAccount = '';
      this.freeAccountTeamId = '';
    }
  }

  @Watch('userEvents', { deep: true })
  onUserEventsChanged(userEvents: Array<UserEventType>) {
    if (!userEvents.length) {
      return;
    }

    const lastUserEvent = userEvents[userEvents.length - 1];
    if (lastUserEvent.userId && lastUserEvent.teamId) {
      userEvents.push({ userId: '', teamId: '' });
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
    //       subscriptions: this.userIds,
    //       teamId: String(this.teamId),
    //     });
    //   }
    // } else {
    //   // create
    //   this.users.push({
    //     id: this.$store.state.user.id,
    //     user: this.$store.state.user.user,
    //     subscriptions: this.accountIds,
    //     teamId: String(this.teamId),
    //   });
    // }
  }

  unsubscribe() {
    this.leaveDialog = false;

    this.teamId = null;

    const { currentAccount } = this;
    const pos = this.users.indexOf(currentAccount);

    if (pos > -1) {
      this.users.splice(pos, 1);
    }
  }

  async createSubAccount(newAccountLabel: string) {
    // fake id,
    const id = String(Math.floor(Math.random() * (100 - 20 + 1) + 20));
    const newUser = {
      id,
      label: newAccountLabel,
    };

    this.accountList.push({ id, label: newAccountLabel });

    this.$store.commit('user/setAccounts', this.accountList);

    return Promise.resolve(newUser);
  }

  removeAccount(id: string) {
    // remove from selected
    let pos = this.accountIds.findIndex((accountId) => accountId === id);
    if (pos > -1) {
      this.accountIds.splice(pos, 1);
    }

    // remove from the available list
    pos = this.accountList.findIndex((account) => account.id === id);
    this.accountList.splice(pos, 1);

    this.$store.commit('user/setAccounts', this.accountList);
  }

  @Prop({ type: String, required: true })
  id: string;
}
