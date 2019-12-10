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
  async updateEvent({ commit }, event: any) {
    await api.updateRaidEx(event);
    commit('updateEvent', event);
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
  updateEvent(_state: RaidExStoreType, raidEx: RaidExType) {
    const pos = _state.events.findIndex((event) => event.id === raidEx.id);
    if (pos > -1) {
      const existingRaidEx = _state.events[pos];
      existingRaidEx.start = raidEx.start;
      existingRaidEx.end = raidEx.end;
      _state.events.splice(pos, 1, existingRaidEx);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
