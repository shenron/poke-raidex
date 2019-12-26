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
    return axios.post('/api/auth/user', account);
  },
  isAvailableUser(user: string) {
    return axios.get(`/api/auth/${user}/available`);
  },
  getUserTypes() {
    return axios.get('/api/admin/users/types');
  },
  updateUserType(userId: string, type: string) {
    return axios.put(`/api/admin/users/${userId}/type/${type}`);
  },
  getUsers() {
    return axios.get('/api/admin/users');
  },
  toggleUserStatus(id: string, isActive: boolean) {
    if (isActive) {
      return axios.put(`/api/admin/users/${id}/enable`);
    }
    return axios.put(`/api/admin/users/${id}/disable`);
  },
  addAccount(user: string) {
    return axios.post('/api/users/account', {
      user,
    });
  },
  updateAccount(id: string, user: string) {
    return axios.put(`/api/users/accounts/${id}/name`, {
      user,
    });
  },
  deleteAccount(userId: string) {
    return axios.delete(`/api/users/accounts/${userId}`);
  },
  updateUser(user: {| oldPassword: string, password: string, user: string |}) {
    return axios.put('/api/users', {
      user,
    });
  },
};
