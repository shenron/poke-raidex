// flow

import axios from 'axios';

export type IdLabelType = {| id: string, label: string |};

export type RaidExType = {|
  id: string,
  users: Array<{
    id: string,
    user: string,
    accountIds: Array<string>,
    teamId: Array<string>,
  }>,
  areaId: string,
  start: string,
  end: string,
|};

export default {
  getRaidExList(): Promise<Array<RaidExType>> {
    return axios.get('/api/raidex');
  },
  getRaidEx(id: string): Promise<RaidExType> {
    return axios.get(`/api/raidex/${id}`);
  },
  getBrowseTeams(): Promise<Array<IdLabelType>> {
    return axios.get('/api/browses/teams');
  },
  getBrowseAreas(): Promise<Array<IdLabelType>> {
    return axios.get('/api/browses/areas');
  },
  getBrowseRaidExTypes(): Promise<Array<IdLabelType>> {
    return axios.get('/api/browses/raidex-types');
  },
};
