// @flow

import { Component, Vue } from 'vue-property-decorator';
import apiUser from '@/api/user';

const { inscription } = apiUser;

export default
@Component
class InscriptionForm extends Vue {
  valid: boolean = true;

  user: ?string = null;

  password: ?string = null;

  passwordBix: ?string = null;

  accounts: Array<string> = [''];

  get passwordRulesBis(): Array<(string) => ?(string | boolean)> {
    return [
      ...this.passwordRules,
      (v) => v === this.password || 'Les mot de passes doivent etre identique',
    ];
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

  /**
   * When blur input, if no empty accounts, push new one
   */
  onAccountChanged() {
    if (this.accounts.findIndex(((account) => !account)) === -1) {
      this.accounts.push('');
    }
  }

  userRules: Array<(string) => ?(string | boolean)> = [
    (v) => !!v || 'Le pseudo est obligatoire!',
  ];

  passwordRules: Array<(string) => ?(string | boolean)> = [
    (v) => !!v || 'Le mot de passe est obligatoire!',
  ];

  accountsRules(i: number): Array<(string) => ?(string | boolean)> {
    return [
      (v) => this.accounts
        .filter((account, j) => j !== i)
        .filter((account) => account === v).length === 0
      || 'Ce petit compte existe deja',
    ];
  }

  async onSubmit() {
    const { user, password, accounts } = this;

    const res = await inscription({
      user,
      password,
      accounts,
    });

    console.log(res);
  }
}
