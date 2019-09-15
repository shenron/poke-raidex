// @flow

import api from '@/api/raidex';

type RaidExType = {
  teams: Array<{ id: string, label: string }>,
  areas: Array<{ id: string, label : string }>
};

const state: RaidExType = {
  teams: [],
  areas: [],
};

const getters = {};

const actions: {
  [id: string]: ({ commit: Function}, Object) => Promise<any>,
} = {
  async getTeams({ commit }) {
    const { data } = await api.getBrowseTeams();
    commit('setTeams', data);
  },
  async getAreas({ commit }) {
    const { data } = await api.getBrowseAreas();
    commit('setAreas', data);
  },
};

const mutations = {
  setTeams(_state: RaidExType, teams: Array<{ id: string, label: string }>) {
    _state.teams = teams;
  },
  setAreas(_state: RaidExType, areas: Array<{ id: string, label: string }>) {
    _state.areas = areas;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
