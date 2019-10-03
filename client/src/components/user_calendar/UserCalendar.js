// @flow

import { Component, Vue } from 'vue-property-decorator';
import type { EventType } from '@/definitions/calendar.d';
import RaidEx from '@/components/raidex/RaidEx.vue';

export default
@Component({
  components: {
    RaidEx,
  },
})
class UserCalendar extends Vue {
  today: string = '2019-01-08';

  focus: string = '2019-01-08';

  selectedEvent: Object = {};

  selectedElement: ?Object = null;

  selectedOpen: boolean = false;

  events: Array<EventType> = [
    {
      id: 1,
      name: 'Chaudron',
      start: '2018-12-29',
      end: '2019-01-01',
      color: 'deep-purple',
    },
    {
      id: 2,
      name: 'Princesse Pauline',
      start: '2018-12-31',
      end: '2019-01-04',
      color: 'blue',
    },
  ];

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

  onCancelSubscription() {

  }

  subscribeEvent() {

  }

  updateRange({ start, end }: { start: Object, end: Object }) {
    // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
    this.startCalendar = start;
    this.endCalendar = end;
  }

  showEvent({ nativeEvent, event }: { nativeEvent: Event, event: Event }) {
    nativeEvent.stopPropagation();
    nativeEvent.stopImmediatePropagation();

    const open = () => {
      this.selectedEvent = event;
      this.selectedElement = nativeEvent.target;
      this.$nextTick(() => {
        this.selectedOpen = true;
      });
    };

    if (this.selectedOpen) {
      this.selectedOpen = false;
      this.$nextTick(open);
    } else {
      open();
    }
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
