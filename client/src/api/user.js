// @flow

import axios from 'axios';

export default {
  login(user: string, password: string) {
    return axios.post('/api/auth', {
      user,
      password,
    });
  },
  logOff() {
    return axios.delete('/api/auth');
  },
  testSession() {
    return axios.get('/api/auth');
  },
  /**
   * create a user account
   */
  registration(account: Object) {
    return axios.post('/api/user', account);
  },
};
