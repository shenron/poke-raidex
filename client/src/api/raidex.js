// @flow

import axios from 'axios';

export type IdLabelType = {| id: string, label: string |};

export type RaidExUserType = {|
  id: string,
  user: string,
  subscriptions: Array<{| teamId: string, userId: string, userName: string, teamName: string |}>,
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
};
