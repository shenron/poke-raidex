// @flow

import { Component, Vue } from 'vue-property-decorator';

export default
@Component
class LoginForm extends Vue {
  valid: boolean = true;

  user: ?string = null;

  password: ?string = null;

  userRules: Array<(string) => ?(string | boolean)> = [
    (v) => !!v || 'Le pseudo est obligatoire!',
  ];

  passwordRules: Array<(string) => ?(string | boolean)> = [
    (v) => !!v || 'Le mot de passe est obligatoire!',
  ];

  async onSubmit() {
    const { user, password } = this;

    const { id } = await this.$store.dispatch('user/login', { user, password });

    if (id) {
      this.$emit('logged');
    }
  }
}
