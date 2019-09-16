// @flow

import { Vue } from 'vue-property-decorator';
import api from '@/api/user';

const userLocalStorage = localStorage.getItem('user');

export type UserStateType = {|
  id: ?string,
  user: string,
  type: ?string,
  accounts: Array<{ id: string, label: string}>,
|};

const state: UserStateType = userLocalStorage ? JSON.parse(userLocalStorage) : {
  id: null,
  user: 'Guest',
  type: null,
  accounts: [],
};

// getters
const getters = {
};

// actions
const actions: {
  [id: string]: ({ commit: Function}, Object) => Promise<any>,
} = {
  async login({ commit }, { user, password }) {
    const { data } = await api.login(user, password);
    commit('setUser', data);

    return data;
  },
  async logOff({ commit }) {
    await api.logOff();
    return commit('logOff');
  },
};

// mutations
const mutations = {
  logOff(_state: UserStateType) {
    localStorage.clear();
    Object.keys(_state).forEach((key) => {
      Vue.set(_state, key, null);
    });
  },
  setUser(_state: UserStateType, user: UserStateType) {
    _state.id = user.id;
    _state.user = user.user;
    _state.type = user.type;
    _state.accounts = user.accounts;

    localStorage.setItem('user', JSON.stringify(_state));
  },
  setAccounts(_state: UserStateType, accounts: Array<{ id: string, label: string}>) {
    _state.accounts = accounts;

    localStorage.setItem('user', JSON.stringify(_state));
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
