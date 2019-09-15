// flow

import axios from 'axios';

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
  getRaidEx(id: string) {
    return axios.get(`/api/raidex/${id}`);
  },
  getBrowseTeams() {
    return axios.get('/api/browses/teams');
  },
  getBrowseAreas() {
    return axios.get('/api/browses/areas');
  },
};
