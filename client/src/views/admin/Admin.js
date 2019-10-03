// @flow

import { Component, Vue } from 'vue-property-decorator';
import AdminCalendar from '@/components/admin_calendar/AdminCalendar.vue';

export default
@Component({
  components: {
    AdminCalendar,
  },
})
class Admin extends Vue {

}
