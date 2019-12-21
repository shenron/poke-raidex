// @flow

import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import api, {
  type RaidExUserType,
  type UserEventType,
} from '@/api/raidex';
import monthNames from '@/_base/monthNames';
import type { UserStateType } from '@/store/modules/user';
import type { IdLabelType } from '@/definitions/IdLabel.d';
import VInputAvailableUser from '../input_available_user/VInputAvailableUser.vue';

const {
  getRaidEx,
  setSubscription,
} = api;

export default
@Component({
  components: {
    VInputAvailableUser,
  },
})
class ConfirmSubscription extends Vue {
  // toggle the modal to save the subscription
  savedModal: boolean = false;

  // toggle the dialog to delete an account
  deleteAccountConfirm: boolean = false;

  // account id to delete when the confirm will be accepted
  accountIdToDelete: ?string = null;

  // model new account, it will be pused in the list of `accountLists`
  freeAccount: string = '';

  // model team of new account, it will be pused in the list of `accountLists`
  freeAccountTeamId: string = '';

  // accounts available for the connected user
  accountList: Array<IdLabelType> = [];

  // saved raid ex - users
  users: Array<RaidExUserType> = [];

  userEvents: Array<UserEventType> = [];

  // keep the initial value of `userEvents` to know if there is a change
  initialUserEvents: Array<UserEventType> = [];

  // saved raid ex - start
  start: ?string = null;

  // saved raid ex - end
  end: ?string = null;

  // saved raid ex - area id
  areaId: ?string = null;

  // user changes something, need to save
  hasBeenChanged: boolean = true;

  /**
   * Accounts subscribed to the event
   */
  get myAccounts() {
    const myId = this.userStore.id;

    const me = this.users
      .find((user) => user.id === myId);

    if (me) {
      return me.subscriptions;
    }

    return [];
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

    // clone to remove binding
    this.initialUserEvents = [...this.userEvents.map((user) => ({
      ...user,
    }))];

    if (!this.userEvents.length) {
      this.userEvents.push({ userId: this.userStore.id, teamId: '' });
    }
  }

  /**
   * this account will be deleted when the `deleteAccountConfirm` accepted
   */
  prepareAccountToDelete(id: string) {
    this.accountIdToDelete = id;
    this.deleteAccountConfirm = true;
  }

  deleteAccount() {
    this.deleteAccountConfirm = false;

    const pos = this.userEvents.findIndex((account) => account.userId === this.accountIdToDelete);
    if (pos > -1) {
      this.userEvents.splice(pos, 1);
    }

    this.$store.dispatch('user/deleteAccount', this.accountIdToDelete);
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

  @Watch('freeUserEvent')
  async onWatchNewAccountChanged(freeAccount: UserEventType) {
    if (freeAccount.userId && freeAccount.teamId && !this.$refs.newAccount.error) {
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

    this.hasBeenChanged = JSON.stringify(userEvents.filter((event) => event.userId))
      !== JSON.stringify(this.initialUserEvents);

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

  async editSubscription(openPopup: Function, e: Event) {
    await setSubscription(this.id, this.userEvents.filter((userEvent) => userEvent.userId));
    this.hasBeenChanged = false;

    // clone to remove binding
    this.initialUserEvents = [...this.userEvents.map((user) => ({
      ...user,
    }))];
    openPopup(e);
  }

  createSubAccount(newAccountLabel: string) {
    return this.$store.dispatch('user/addAccount', newAccountLabel);
  }

  @Prop({ type: String, required: true })
  id: string;
}
