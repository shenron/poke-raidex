// @flow

import { Component, Watch, Vue } from 'vue-property-decorator';

export default
@Component
class Admin extends Vue {
  activeBtn: string = 'ADMIN';

  created() {
    this.activeBtn = this.$route.name.toUpperCase();
  }

  @Watch('activeBtn')
  onActiveBtnChanged(activeBtn: string) {
    this.$router.push({ name: activeBtn.toLowerCase() });
  }
}
