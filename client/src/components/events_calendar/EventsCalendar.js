// @flow

import { Component, Vue, Watch } from 'vue-property-decorator';
import type { EventType } from '@/definitions/calendar.d';

export default
@Component
class AdminCalendar extends Vue {
  today: string = '2019-01-08';

  focus: string = '2019-01-08';

  startEventMenu: boolean = false;

  startEvent: string = '2019-01-08';

  endEventMenu: boolean = false;

  endEvent: string = '2019-01-08';

  startCalendar: ?Object = null;

  endCalendar: ?Object = null;

  selectedEvent: Object = {};

  selectedElement: ?Object = null;

  selectedOpen: boolean = false;

  eventToUpdate: ?EventType = null;

  eventType: 'INFO' | 'DEFAULT' = 'DEFAULT';

  events: Array<EventType> = [];

  arenaId: ?number = 0;

  eventDialogHelper: ?boolean = false;

  // used for info event
  hourEvent: ?string = null;

  get eventTypes() {
    return this.$store.state.raidex.types;
  }

  get calendarType() {
    return 'month';
  }

  get eventColors(): Array<string> {
    return ['deep-purple', 'blue', 'green'];
  }

  get eventsStored() {
    return this.$store.raidex.events;
  }

  get arenaList() {
    return this.$store.state.raidex.areas;
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

  get monthFormatter() {
    return this.$refs.calendar.getFormatter({
      timeZone: 'UTC',
      month: 'long',
    });
  }

  get hourEventRules() {
    const err = 'ex: 13:30';
    return [(value: ?string) => {
      if (!value) {
        return err;
      }
      return value.match(/^[0-9]{1,2}:[0-9]{1,2}$/g) ? true : err;
    }];
  }

  get isValidForm() {
    const isValid = !!this.eventType && this.arenaId;
    if (this.eventType === 'DEFAULT') {
      return isValid && this.startEvent && this.hourEventRules.reduce((acc, v) => acc && v(this.hourEvent) === true, true);
    } if (this.eventType === 'INFO') {
      return isValid && this.startEvent && this.endEvent;
    }
    return false;
  }

  @Watch('eventType')
  onEventTypeChanged() {
    this.endEvent = '';
    this.hourEvent = '';
  }

  @Watch('$store.state.raidex.events', { immediate: true })
  onEventsStored(events: Array<EventType>) {
    this.events = [...events.map((event) => ({ ...event }))];
  }

  onDeleteEvent(eventToDelete: EventType) {
    this.selectedOpen = false;

    this.$store.dispatch('raidex/deleteRaidEx', eventToDelete.id);
  }

  getEventColor(event: Object) {
    return event.color;
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

  addEvent() {
    let name = '';
    if (this.arenaId) {
      const arenaFound = this.arenaList.find((arena) => arena.id === this.arenaId);
      if (arenaFound) {
        name = arenaFound.label;
      }
    }

    if (!name || !this.startEvent || !this.endEvent || !this.arenaId || !this.isValidForm) {
      return;
    }

    // before, save the event in BD
    this.$store.dispatch('raidex/addRaidEx', {
      start: this.startEvent,
      ...(this.eventType === 'DEFAULT' ? { hour: this.hourEvent } : { end: this.endEvent }),
      type: this.eventType || 'DEFAULT',
      areaId: this.arenaId,
    });
  }

  enableUpdateDateEvent(event: EventType) {
    this.selectedOpen = false;
    this.eventToUpdate = {
      ...event,
      start: null,
      end: null,
    };

    event.color = 'orange';
  }

  updateDateEvent({ date }: { date: string }) {
    if (this.eventToUpdate) {
      if (!this.eventToUpdate.start) {
        this.eventToUpdate.start = date;
      } else if (!this.eventToUpdate.end) {
        this.eventToUpdate.end = date;
      }

      // ready to save
      if (this.eventToUpdate && this.eventToUpdate.start && this.eventToUpdate.end) {
        // update the event in db
        this.$store.dispatch('raidex/updateEvent', this.eventToUpdate);

        this.eventToUpdate = null;
      }
    }
  }

  showEvent({ nativeEvent, event }: { nativeEvent: Event, event: Event }) {
    nativeEvent.stopPropagation();
    nativeEvent.stopImmediatePropagation();

    if (this.eventToUpdate) {
      return;
    }

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

  updateRange({ start, end }: { start: Object, end: Object }) {
    // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
    this.startCalendar = start;
    this.endCalendar = end;
  }
}
