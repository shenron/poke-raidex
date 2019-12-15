// @flow

import { Component, Vue } from 'vue-property-decorator';
import UsersManagement from '@/components/users_management/UsersManagement.vue';

export default
@Component({
  components: {
    UsersManagement,
  },
})
class AdminUsersManagement extends Vue {

}
