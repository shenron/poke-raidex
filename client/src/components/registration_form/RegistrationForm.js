// @flow

import { Component, Vue } from 'vue-property-decorator';
import userApi from '@/api/user';
import debounce from '@/_base/debounce';

const ERROR_ALREADY_EXIST = 'Ce petit compte existe deja';

export default
@Component
class RegistrationForm extends Vue {
  valid: boolean = true;

  user: ?string = null;

  password: ?string = null;

  passwordBix: ?string = null;

  accounts: Array<string> = [''];

  userErrors: Array<?string> = [];

  /**
   * add a debounce to the existing test user
   */
  get testDebounceUser() {
    // before insert the error, look if the array complete
    const insertError = (i: number, msg: string) => {
      while (this.userErrors.length < i) {
        this.userErrors.push('');
      }

      // emit change for existing
      if (i < this.userErrors.length) {
        this.userErrors.splice(i, 1, msg);
      } else {
        this.userErrors.push(msg);
      }
    };

    return debounce(async (i: number, user: string) => {
      if (!user) {
        return insertError(i, '');
      }

      const { data } = await userApi.isAvailableUser(user);
      if (data) {
        insertError(i, '');
      } else {
        insertError(i, ERROR_ALREADY_EXIST);
      }
    }, 100);
  }

  get passwordRulesBis(): Array<(string) => ?(string | boolean)> {
    return [
      ...this.passwordRules,
      (v) => v === this.password || 'Les mot de passes doivent etre identique',
    ];
  }

  onMainAccountUpdated() {
    this.testDebounceUser(0, this.user);
  }

  /**
   * When input, clear empty accounts
   */
  onAccountUpdated(i: number) {
    const { length } = this.accounts;

    if (!this.accounts[i] && i < length - 1) {
      this.accounts.splice(i, 1);
    }

    this.testDebounceUser(
      i + 1 /* errors are common for main user and sub accounts */,
      this.accounts[i],
    );
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
      (v) => [
        ...this.accounts,
        this.user,
      ]
        .filter((account, j) => j !== i)
        .filter((account) => account === v).length === 0 || ERROR_ALREADY_EXIST,
    ];
  }

  async onSubmit() {
    const { user, password, accounts } = this;

    const { id } = await this.$store.dispatch('user/registration', {
      user,
      password,
      accounts: accounts.filter(Boolean),
    });

    if (id) {
      this.$emit('logged');
    }
  }
}
