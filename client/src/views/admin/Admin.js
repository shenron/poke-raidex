// @flow

import { Component, Watch, Vue } from 'vue-property-decorator';
import AdminCalendar from '@/components/admin_calendar/AdminCalendar.vue';

export default
@Component({
  components: {
    AdminCalendar,
  },
})
class Admin extends Vue {
  activeBtn: string = '';

  @Watch('activeBtn')
  onActiveBtnChanged(activeBtn: string) {
    this.$router.push({ name: activeBtn.toLowerCase() });
  }
}
