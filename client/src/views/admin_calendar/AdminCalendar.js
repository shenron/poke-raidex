// @flow

import { Component, Vue } from 'vue-property-decorator';
import AdminCalendarComponent from '@/components/admin_calendar/AdminCalendar.vue';

export default
@Component({
  components: {
    AdminCalendar: AdminCalendarComponent,
  },
})
class AdminCalendarView extends Vue {

}
