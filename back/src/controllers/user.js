// @flow

import User from '@/models/User';

export default {
};

export async function getUsers() {
  return User
    .find({})
    .populate('accounts');
}
