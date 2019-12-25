// @flow

import { Component, Vue } from 'vue-property-decorator';
import VInputAvailableUser from '@/components/input_available_user/VInputAvailableUser.vue';

const ERROR_MINIMUM = '6 carcatères est nécessaire';

export default
@Component({
  components: {
    VInputAvailableUser,
  },
})
class UserSettings extends Vue {
  user: string = '';

  valid: boolean = true;

  oldPassword: string = '';

  password: string = '';

  passwordBis: string = '';

  success: boolean = false;

  error: ?Error = null;

  get passwordRules(): Array<(string) => ?(string | boolean)> {
    return [
      (v) => v.length === 0 || v.length >= 6 || ERROR_MINIMUM,
    ];
  }

  get passwordRulesBis(): Array<(string) => ?(string | boolean)> {
    const { password } = this;
    return [
      (v) => (v.length === 0 && password.length === 0) || v.length >= 6 || ERROR_MINIMUM,
      (v) => v === this.password || 'Les mot de passes doivent etre identique',
    ];
  }

  created() {
    this.user = this.$store.state.user.user;
  }

  async onSubmit() {
    const { user, password, oldPassword } = this;

    try {
      await this.$store.dispatch('user/updateUser', {
        user,
        password,
        oldPassword,
      });

      this.password = '';
      this.oldPassword = '';
      this.passwordBis = '';
      this.success = true;
      this.error = null;
    } catch (e) {
      this.error = e;
      this.success = false;
    }
  }
}
