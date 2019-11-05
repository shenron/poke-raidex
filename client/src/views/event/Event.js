// @flow

import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import ConfirmSubscription from '@/components/confirm_subscription/ConfirmSubscription.vue';
import UserList from '@/components/user_list/UserList.vue';

type EventRoutesType = 'LIST' | 'SUBSCRIPTION' | 'HOME';

export default
@Component({
  components: {
    ConfirmSubscription,
    UserList,
  },
})
class Event extends Vue {
  activeBtn: EventRoutesType = 'SUBSCRIPTION';

  @Watch('activeBtn')
  onActiveBtnChanged(activeBtn: EventRoutesType) {
    if (activeBtn === 'HOME') {
      this.$router.push({ name: 'home' });
    }
  }

  @Prop({ type: String, required: true })
  id: string;
}
