// @flow

import { Component, Vue } from 'vue-property-decorator';
import userApi from '@/api/user';
import type { UserStateType } from '@/store/modules/user';

export default
@Component
class usersManagement extends Vue {
  users: Array<UserStateType> = [];

  async created() {
    const { data } = await userApi.getUsers();
    this.users = data;
  }

  toggleUserStatus(user: UserStateType) {
    return userApi.toggleUserStatus(String(user.id), user.isActive === true);
  }
}
