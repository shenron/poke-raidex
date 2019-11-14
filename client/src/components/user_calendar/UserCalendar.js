// @flow

import { Component, Vue } from 'vue-property-decorator';
import type { EventType } from '@/definitions/calendar.d';

export default
@Component
class UserCalendar extends Vue {
  today: string = '2019-01-08';

  focus: string = '2019-01-08';

  get events(): Array<EventType> {
    return this.$store.state.raidex.events;
  }

  get type() {
    return 'month';
  }

  get monthFormatter() {
    return this.$refs.calendar.getFormatter({
      timeZone: 'UTC',
      month: 'long',
    });
  }

  get title() {
    const { startCalendar, endCalendar } = this;

    let startMonth;
    let startYear;
    if (!startCalendar || !endCalendar) {
      const date = new Date(this.today);
      startMonth = date.toLocaleString('default', { month: 'long' });
      startYear = date.getFullYear();
    } else {
      startMonth = this.monthFormatter(startCalendar);
      startYear = startCalendar.year;
    }

    return `${startMonth} ${startYear}`;
  }

  getEventColor(event: Object) {
    return event.color;
  }

  updateRange({ start, end }: { start: Object, end: Object }) {
    // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
    this.startCalendar = start;
    this.endCalendar = end;
  }

  pushRouteEvent({ event }: { nativeEvent: Event, event: EventType }) {
    this.$router.push({ name: 'event', params: { id: event.id } });
  }

  setToday() {
    this.focus = this.today;
  }

  prev() {
    this.$refs.calendar.prev();
  }

  next() {
    this.$refs.calendar.next();
  }
}
