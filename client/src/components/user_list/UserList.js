// @flow

import { Component, Prop, Vue } from 'vue-property-decorator';
import api, { type RaidExUserType } from '@/api/raidex';

const { getRaidEx } = api;

export default
@Component
class UserList extends Vue {
  users: Array<RaidExUserType> = [];

  get headers() {
    return [{
      text: 'Joueur',
      align: 'left',
      sortable: false,
      value: 'userName',
    }, {
      text: 'Equipe',
      align: 'left',
      sortable: true,
      value: 'teamName',
    }];
  }

  get players() {
    // $FlowFixMe
    return this.users.reduce((acc, v) => {
      acc.subscriptions = [...acc.subscriptions, ...v.subscriptions];
      return acc;
    }, {
      subscriptions: [],
    }).subscriptions;
  }

  async created() {
    const { data } = await getRaidEx(this.id);

    this.users = data.users;
  }

  @Prop({ type: String, required: true })
  id: string;
}
