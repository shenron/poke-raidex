// @flow

import { Vue } from 'vue-property-decorator';
import api from '@/api/user';

const userLocalStorage = localStorage.getItem('user');

export type UserStateType = {|
  id: ?string,
  user: ?string,
  type: ?string,
|};

const state: UserStateType = userLocalStorage ? JSON.parse(userLocalStorage) : {
  id: null,
  user: 'Guest',
  type: null,
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
    Object.keys(user).forEach((key) => {
      if (user[key] !== undefined) {
        _state[key] = user[key];
      }
    });
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
