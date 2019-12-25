// @flow

import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import userApi from '@/api/user';
import debounce from '@/_base/debounce';

const ERROR_ALREADY_EXIST = 'Ce petit compte existe deja';

const ERROR_MINIMUM = '3 carcatères est nécessaire';

export default
@Component({
  inheritAttrs: false,
})
class VInputAvailableUser extends Vue {
  value$: ?string = '';

  error: string = '';

  /**
   * add a debounce to the existing test user
   */
  get testDebounceUser() {
    return debounce(async (user: string) => {
      if (!user) {
        return;
      }

      const { data } = await userApi.isAvailableUser(user);
      if (data) {
        this.error = '';
      } else {
        this.error = ERROR_ALREADY_EXIST;
      }
    }, 100);
  }

  get rules(): Array<(string) => ?(string | boolean)> {
    const rules = [
      (v) => this.tmpUsers.filter((account) => account === v).length === 0 || ERROR_ALREADY_EXIST,
      (v) => v.length >= 3 || ERROR_MINIMUM,
    ];

    if (this.required === '' || this.required === true) {
      rules.push((v) => !!v || 'Le pseudo est obligatoire!');
    }

    return rules;
  }

  onChange(user: string) {
    this.testDebounceUser(user);
    return this.$emit('input', user);
  }

  @Watch('error')
  onErrorChanged(error: string) {
    if (error) {
      this.$emit('error', error);
    } else {
      this.$emit('success', this.value$);
    }
  }

  @Watch('value', { immediate: true })
  onValueChanged(value: ?string) {
    this.value$ = value;
  }

  @Prop({ type: String })
  value: ?string;

  /**
   * Users not already saved
   * Used by the registration component
   */
  @Prop({
    type: Array,
    default() {
      return [];
    },
  })
  tmpUsers: Array<string>;

  @Prop({ type: String })
  label: ?string;

  @Prop({ type: [String, Boolean] })
  required: boolean | string;
}
