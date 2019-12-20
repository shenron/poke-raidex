// @flow

import { Component, Prop, Vue } from 'vue-property-decorator';
import RegistrationForm from '@/components/registration_form/RegistrationForm.vue';

export default
@Component({
  components: {
    RegistrationForm,
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

  @Prop({ type: Boolean })
  isDone: boolean;
}
