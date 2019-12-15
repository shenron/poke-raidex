// @flow

import { Component, Vue } from 'vue-property-decorator';
import userApi from '@/api/user';

export default
@Component
class usersManagement extends Vue {
  async created() {
    const r = await userApi.getUsers();
    console.log(r);
  }
}
