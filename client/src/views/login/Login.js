// @flow

import { Component, Vue } from 'vue-property-decorator';
import LoginForm from '@/components/LoginForm.vue';

export default
@Component({
  components: {
    LoginForm,
  },
})
class Login extends Vue {
  get user() {
    return this.$store.state.user;
  }

  created(to: Object, from: Object, next: ?Function) {
    if (!next) {
      return;
    }

    next((vm: Vue) => {
      if (vm.user.id) {
        vm.$router.push({ name: 'home' });
      }
    });
  }
}
