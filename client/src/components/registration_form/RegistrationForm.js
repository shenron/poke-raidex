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
class RegistrationForm extends Vue {
  valid: boolean = true;

  user: string = '';

  password: string = '';

  passwordBix: string = '';

  accounts: Array<string> = [''];

  passwordRules: Array<(string) => ?(string | boolean)> = [
    (v) => !!v || 'Le mot de passe est obligatoire!',
    (v) => v.length >= 6 || ERROR_MINIMUM,
  ];

  get passwordRulesBis(): Array<(string) => ?(string | boolean)> {
    return [
      ...this.passwordRules,
      (v) => v === this.password || 'Les mot de passes doivent etre identique',
    ];
  }

  /**
   * When blur input, if no empty accounts, push new one
   */
  onAccountChanged() {
    if (this.accounts.findIndex(((account) => !account)) === -1) {
      this.accounts.push('');
    }
  }

  /**
   * When input, clear empty accounts
   */
  onAccountUpdated(i: number) {
    const { length } = this.accounts;

    if (!this.accounts[i] && i < length - 1) {
      this.accounts.splice(i, 1);
    }
  }

  async onSubmit() {
    const { user, password, accounts } = this;

    const { id } = await this.$store.dispatch('user/registration', {
      user,
      password,
      accounts: accounts.filter(Boolean),
    });

    if (id) {
      this.$emit('registered');
    }
  }
}
