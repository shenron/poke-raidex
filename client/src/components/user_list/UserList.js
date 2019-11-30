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
      value: 'name',
    }];
  }

  get players() {
    return [{
      id: 1,
      name: 'Toto',
    }, {
      id: 2,
      name: 'TATA',
    }];
  }

  async created() {
    const { data } = await getRaidEx(this.id);

    this.users = data.users;
  }

  @Prop({ type: String, required: true })
  id: string;
}
