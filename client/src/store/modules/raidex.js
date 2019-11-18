// @flow

import api, { type IdLabelType, type RaidExType } from '@/api/raidex';
import type { EventType } from '@/definitions/calendar.d';

type RaidExStoreType = {
  teams: Array<IdLabelType>,
  areas: Array<IdLabelType>,
  types: Array<IdLabelType>,
  events: Array<EventType>,
};

const colors = ['blue', 'deep-purple'];

const state: RaidExStoreType = {
  teams: [],
  areas: [],
  types: [],
  events: [],
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
  async getTypes({ commit }) {
    const { data } = await api.getBrowseRaidExTypes();
    commit('setTypes', data);
  },
  async getEvents({ commit }) {
    const { data } = await api.getRaidExList();
    commit('setEvents', data);
  },
};

const mutations = {
  setTeams(_state: RaidExStoreType, teams: Array<IdLabelType>) {
    _state.teams = teams;
  },
  setAreas(_state: RaidExStoreType, areas: Array<IdLabelType>) {
    _state.areas = areas;
  },
  setTypes(_state: RaidExStoreType, types: Array<IdLabelType>) {
    _state.types = types;
  },
  setEvents(_state: RaidExStoreType, raidExList: Array<RaidExType>) {
    const events = raidExList.map((raid, i) => ({
      id: raid.id,
      start: raid.start,
      end: raid.end,
      name: (_state.areas.find((area) => area.id === raid.areaId) || {}).label,
      color: colors[i % 2],
      type: raid.type,
    }));
    _state.events = events;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
