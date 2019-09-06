// @flow

import { Vue } from 'vue-property-decorator';
import Vuex from 'vuex';
import user from './modules/user';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
  },
});
