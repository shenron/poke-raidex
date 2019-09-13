<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex xs12 class="core-goto">
        <v-img
          :src="require('../assets/pokemon_center.png')"
          class="my-3"
          contain
          height="164"
        ></v-img>
      </v-flex>
    </v-layout>

    <v-row class="fill-height">
      <v-col sm="12" lg="3">
        <form>
          <v-select
            v-model="arenaId"
            item-value="id"
            item-text="label"
            :items="arenaList"
            label="Arène"
          ></v-select>

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
              <v-text-field
                v-model="startEvent"
                label="Debut"
                readonly
                v-on="on"
              >
                <template v-slot:prepend>
                  <v-icon small>mdi-calendar</v-icon>
                </template>
              </v-text-field>
            </template>
            <v-date-picker v-model="startEvent" no-title scrollable>
              <div class="flex-grow-1"></div>
              <v-btn text color="primary" @click="startEvent = false">
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.startEventMenu.save(startEvent)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>

          <v-menu
            ref="endEventMenu"
            v-model="endEventMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="endEvent"
            transition="scale-transition"
            min-width="290px"
            offset-y
          >
            <template v-slot:activator="{ on }">
              <v-text-field v-model="endEvent" label="Fin" readonly v-on="on">
                <template v-slot:prepend>
                  <v-icon small>mdi-calendar</v-icon>
                </template>
              </v-text-field>
            </template>
            <v-date-picker v-model="endEvent" no-title scrollable>
              <div class="flex-grow-1"></div>
              <v-btn text color="primary" @click="endEvent = false">
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.endEventMenu.save(endEvent)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>

          <v-btn color="primary">
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
            @change="updateRange"
          ></v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card color="grey lighten-4" min-width="350px" flat>
              <v-toolbar :color="selectedEvent.color" dark>
                <v-btn icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <div class="flex-grow-1"></div>
                <v-btn icon>
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.details"></span>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="secondary" @click="selectedOpen = false">
                  Cancel
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

  events: Array<{|
    name: string,
    details?: string,
    start: string,
    end?: string,
    color: string,
  |}> = [
    {
      name: 'Event 1',
      details: 'Going to the beach!',
      start: '2018-12-29',
      end: '2019-01-01',
      color: 'blue',
    },
    {
      name: 'Event 2',
      details:
        'This starts in the middle of an event and spans over multiple events',
      start: '2018-12-31',
      end: '2019-01-04',
      color: 'deep-purple',
    },
  ];

  arenaId: ?number = 0;

  get arenaList() {
    return [
      { id: 1, label: 'Chaudron' },
      { id: 2, label: 'Princesse Pauline' },
      { id: 3, label: 'Mougins' },
    ];
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

  showEvent({ nativeEvent, event }: { nativeEvent: Event, event: Event }) {
    const open = () => {
      this.selectedEvent = event;
      this.selectedElement = nativeEvent.target;
      setTimeout(() => {
        this.selectedOpen = true;
      }, 10);
    };

    if (this.selectedOpen) {
      this.selectedOpen = false;
      setTimeout(open, 10);
    } else {
      open();
    }

    nativeEvent.stopPropagation();
  }

  updateRange({ start, end }: { start: Object, end: Object }) {
    // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
    this.startCalendar = start;
    this.endCalendar = end;
  }

  nth(d: number) {
    return d > 3 && d < 21
      ? 'th'
      : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10];
  }
}
</script>
