// @flow

import api from '@/api/user';

export type UserStateType = {|
  id: ?string,
  user: ?string,
  type: ?string,
|};

const state: UserStateType = {
  id: null,
  user: 'Guest',
  type: null,
};

// getters
const getters = {};

// actions
const actions: {
  [id: string]: ({ commit: Function}, Object) => Promise<any>,
} = {
  async login({ commit }, { user, password }) {
    const { data } = await api.login(user, password);
    commit('setUser', data);
  },
};

// mutations
const mutations = {
  logoff(_state: UserStateType) {
    _state.id = null;
    _state.user = 'Guest';
    _state.type = null;
  },
  setUser(_state: UserStateType, user: UserStateType) {
    Object.keys(user).forEach((key) => {
      if (user[key] !== undefined) {
        _state[key] = user[key];
      }
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
