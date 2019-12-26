// @flow

import { Component, Vue } from 'vue-property-decorator';
import userApi from '@/api/user';
import type { UserStateType } from '@/store/modules/user';

export default
@Component
class usersManagement extends Vue {
  users: Array<UserStateType> = [];

  userTypes: Array<{| id: string, label: string |}> = []

  async created() {
    const [users, types] = await Promise.all([
      userApi.getUsers(),
      userApi.getUserTypes(),
    ]);

    this.users = users.data;
    this.userTypes = types.data;
  }

  updateUserType(userId: string, type: string) {
    return userApi.updateUserType(userId, type);
  }

  toggleUserStatus(user: UserStateType) {
    return userApi.toggleUserStatus(String(user.id), user.isActive === true);
  }
}
