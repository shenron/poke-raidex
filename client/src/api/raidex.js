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
  id: string,
  type: 'INFO' | 'DEFAULT',
  users: Array<RaidExUserType>,
  areaId: string,
  start: string,
  end: string,
|};

export default {
  getRaidExList(): Promise<{| data: Array<RaidExType> |}> {
    return axios.get('/api/raidex');
  },
  getRaidEx(id: string): Promise<{| data: RaidExType |}> {
    return axios.get(`/api/raidex/${id}`);
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
    return axios.post(`/api/raidex/${id}/subscriptions`, {
      users,
    });
  },
};
