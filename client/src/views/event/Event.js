// @flow

import { Component, Prop, Vue } from 'vue-property-decorator';
import ConfirmSubscription from '@/components/confirm_subscription/ConfirmSubscription.vue';

export default
@Component({
  components: {
    ConfirmSubscription,
  },
})
class Event extends Vue {
  get activeBtn() {
    return 1;
  }

  @Prop({ type: String, required: true })
  id: string;
}
