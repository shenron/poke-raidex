// @flow

import { Component, Vue } from 'vue-property-decorator';
import api from '@/api/raidex';
import UserCalendar from '@/components/user_calendar/UserCalendar.vue';

const { getRaidExList } = api;

export default
@Component({
  components: {
    UserCalendar,
  },
})
class Home extends Vue {
  raidExList: Array<string> = [];

  get activeBtn() {
    return 1;
  }

  async created() {
    const { data } = await getRaidExList();

    this.raidExList = data;
  }
}
