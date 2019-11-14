// @flow

import { Component, Vue, Watch } from 'vue-property-decorator';
import UserCalendar from '@/components/user_calendar/UserCalendar.vue';

export default
@Component({
  components: {
    UserCalendar,
  },
})
class Home extends Vue {
  activeBtn: string = 'HOME';

  @Watch('activeBtn')
  onActiveBtnChanged(activeBtn: string) {
    this.$router.push({ name: activeBtn.toLowerCase() });
  }
}
