// @flow

import { Vue } from 'vue-property-decorator';
import api from '@/api/user';
import type { IdLabelType } from '@/definitions/IdLabel.d';

const userLocalStorage = localStorage.getItem('user');

export type UserStateType = {|
  id: ?string,
  user: string,
  type: ?string,
  isActive?: boolean,
  accounts: Array<IdLabelType>,
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
  async registration(_: any, account: {| user: string, password: string, accounts: Array<string> |}) {
    const { data } = await api.registration(account);
    return data;
  },
  async updateAccount({ commit }, account: {|id: string, user: string |}) {
    await api.updateAccount(account.id, account.user);

    return commit('updateAccount', account);
  },
  async addAccount({ commit }, accountName: string) {
    const { data } = await api.addAccount(accountName);
    commit('addAccount', data);

    return data;
  },
  async deleteAccount({ commit }, accountId: string) {
    await api.deleteAccount(accountId);

    return commit('deleteAccount', accountId);
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
  deleteAccount(_state: UserStateType, accountId: string) {
    const pos = _state.accounts.findIndex((account) => account.id === accountId);
    if (pos > -1) {
      _state.accounts.splice(pos, 1);
    }

    localStorage.setItem('user', JSON.stringify(_state));
  },
  addAccount(_state: UserStateType, account: IdLabelType) {
    _state.accounts.push(account);

    localStorage.setItem('user', JSON.stringify(_state));
  },
  setAccounts(_state: UserStateType, accounts: Array<IdLabelType>) {
    _state.accounts = accounts;

    localStorage.setItem('user', JSON.stringify(_state));
  },
  updateAccount(_state: UserStateType, account: {|id: string, user: string |}) {
    const pos = _state.accounts.findIndex((_account) => _account.id === account.id);
    if (pos > -1) {
      _state.accounts.splice(pos, 1, {
        id: account.id,
        label: account.user,
      });
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
