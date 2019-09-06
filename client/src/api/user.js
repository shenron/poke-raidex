// @flow

import axios from 'axios';

export default {
  login(user: string, password: string) {
    return axios.post('/api/auth', {
      user,
      password,
    });
  },
};
