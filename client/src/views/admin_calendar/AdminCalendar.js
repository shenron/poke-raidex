// @flow

import { Component, Vue } from 'vue-property-decorator';
import EventsCalendar from '@/components/events_calendar/EventsCalendar.vue';

export default
@Component({
  components: {
    EventsCalendar,
  },
})
class AdminCalendarView extends Vue {

}
