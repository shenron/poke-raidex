// @flow

import { Vue } from 'vue-property-decorator';
import Vuex from 'vuex';
import user from './modules/user';
import raidex from './modules/raidex';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    raidex,
  },
});
