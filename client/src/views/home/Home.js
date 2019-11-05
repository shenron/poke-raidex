// @flow

import { Component, Vue, Watch } from 'vue-property-decorator';
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

  activeBtn: string = 'HOME';

  @Watch('activeBtn')
  onActiveBtnChanged(activeBtn: string) {
    this.$router.push({ name: activeBtn.toLowerCase() });
  }

  async created() {
    const { data } = await getRaidExList();

    this.raidExList = data;
  }
}
