// @flow

import axios from 'axios';

export type IdLabelType = {| id: string, label: string |};

export type UserEventType = {|
  userId: string,
  teamId: string,
|};

export type RaidExUserType = {|
  id: string,
  user: string,
  // display name of user and team
  subscriptions: Array<{|
    ...UserEventType,
    userName: string,
    teamName: string,
  |}>,
  teamId: Array<string>,
|};

export type RaidExType = {|
  id?: string,
  type: 'INFO' | 'DEFAULT',
  users: Array<RaidExUserType>,
  areaId: string,
  start: string,
  end?: string,
  hour?: string,
|};

export default {
  getRaidExList(): Promise<{| data: Array<RaidExType> |}> {
    return axios.get('/api/raidex');
  },
  deleteRaidEx(id: string) {
    return axios.delete(`/api/raidex/${id}`);
  },
  getRaidEx(id: string): Promise<{| data: RaidExType |}> {
    return axios.get(`/api/raidex/${id}`);
  },
  addRaidEx(raidEx: RaidExType) {
    return axios.post('/api/admin/raidex', {
      raidEx,
    });
  },
  getBrowseTeams(): Promise<{| data: Array<IdLabelType> |}> {
    return axios.get('/api/browses/teams');
  },
  getBrowseAreas(): Promise<{| data: Array<IdLabelType> |}> {
    return axios.get('/api/browses/areas');
  },
  getBrowseRaidExTypes(): Promise<{| data: Array<IdLabelType> |}> {
    return axios.get('/api/browses/raidex-types');
  },
  setSubscription(id: string, users: Array<UserEventType>) {
    return axios.post(`/api/raidex/${id}/subscription`, {
      users,
    });
  },
};
