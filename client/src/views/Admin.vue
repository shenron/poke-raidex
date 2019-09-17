<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex xs12 class="core-goto">
        <v-img :src="require('../assets/pokemon_center.png')" class="my-3" contain height="164"></v-img>
      </v-flex>
    </v-layout>

    <v-row class="fill-height">
      <v-col sm="12" lg="3">
        <form>
          <v-select v-model="arenaId" item-value="id" item-text="label" :items="arenaList" label="Arène"></v-select>

          <v-menu
            ref="startEventMenu"
            v-model="startEventMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="startEvent"
            transition="scale-transition"
            min-width="290px"
            offset-y
          >
            <template v-slot:activator="{ on }">
              <v-text-field v-model="startEvent" label="Debut" readonly v-on="on">
                <template v-slot:prepend>
                  <v-icon small>mdi-calendar</v-icon>
                </template>
              </v-text-field>
            </template>
            <v-date-picker v-model="startEvent" no-title scrollable>
              <div class="flex-grow-1"></div>
              <v-btn text color="primary" @click="startEventMenu = false">
                Annuler
              </v-btn>
              <v-btn text color="primary" @click="$refs.startEventMenu.save(startEvent)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>

          <v-menu ref="endEventMenu" v-model="endEventMenu" :close-on-content-click="false" :nudge-right="40" :return-value.sync="endEvent" transition="scale-transition" min-width="290px" offset-y>
            <template v-slot:activator="{ on }">
              <v-text-field v-model="endEvent" label="Fin" readonly v-on="on">
                <template v-slot:prepend>
                  <v-icon small>mdi-calendar</v-icon>
                </template>
              </v-text-field>
            </template>
            <v-date-picker v-model="endEvent" no-title scrollable>
              <div class="flex-grow-1"></div>
              <v-btn text color="primary" @click="endEventMenu = false">
                Annuler
              </v-btn>
              <v-btn text color="primary" @click="$refs.endEventMenu.save(endEvent)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>

          <v-btn @click="addEvent" color="primary">
            Ajouter
          </v-btn>
        </form>
      </v-col>

      <v-col>
        <v-sheet height="64">
          <v-toolbar flat color="white">
            <v-btn outlined class="mr-4" @click="setToday">
              Aujourd'hui
            </v-btn>
            <v-btn fab text small @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
          </v-toolbar>
        </v-sheet>

        <small v-if="eventToUpdate">
          Selection du nouvelle date
          <strong>
            <template v-if="!eventToUpdate.start">
              de début</template
            >
            <template v-else>
              de fin</template
            >
          </strong>
        </small>

        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :event-margin-bottom="3"
            :now="today"
            :type="type"
            @click:event="showEvent"
            @click:date="updateDateEvent"
            @click:day="updateDateEvent"
            @change="updateRange"
          ></v-calendar>
          <v-menu v-if="!eventToUpdate" v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
            <v-card color="grey lighten-4" min-width="200px" flat>
              <v-toolbar :color="selectedEvent.color" dark>
                <v-btn icon @click="enableUpdateDateEvent(selectedEvent)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              </v-toolbar>
              <v-card-actions>
                <v-btn @click="onCancelEvent(selectedEvent)">
                  <v-icon>mdi-trash-can</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @flow

import { Component, Vue } from 'vue-property-decorator';

type EventType = {|
  id: number,
  name: string,
  start: ?string,
  end: ?string,
  color: string,
|};

export default
@Component
class Admin extends Vue {
  today: string = '2019-01-08';

  focus: string = '2019-01-08';

  type: string = 'month';

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

  get eventColors(): Array<string> {
    return ['deep-purple', 'blue', 'green'];
  }

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

  arenaId: ?number = 0;

  eventDialogHelper: ?boolean = false;

  get arenaList() {
    return [{ id: 1, label: 'Chaudron' }, { id: 2, label: 'Princesse Pauline' }, { id: 3, label: 'Mougins' }];
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

  onCancelEvent(eventToDelete: EventType) {
    this.selectedOpen = false;

    const pos = this.events.findIndex(event => event.id === eventToDelete.id);
    if (pos > -1) {
      this.events.splice(pos, 1);
    }
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
      const arenaFound = this.arenaList.find(arena => arena.id === this.arenaId);
      if (arenaFound) {
        name = arenaFound.label;
      }
    }

    if (!name || !this.startEvent || !this.endEvent || !this.arenaId) {
      return;
    }

    // before, save the event in BD

    this.events.push({
      id: -1,
      name,
      start: this.startEvent,
      end: this.endEvent,
      color: this.eventColors[this.arenaId] || 'grey',
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
      if (this.eventToUpdate.start && this.eventToUpdate.end) {
        // save in BD

        const pos = this.events.findIndex(event => event.id === (this.eventToUpdate ? this.eventToUpdate.id : -1));
        if (pos === -1) {
          throw Error('Impossible to update the bind event');
        }

        if (this.eventToUpdate) {
          this.events.splice(pos, 1, this.eventToUpdate);

          this.eventToUpdate = null;
        }
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

  nth(d: number) {
    return d > 3 && d < 21 ? 'th' : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10];
  }
}
</script>
