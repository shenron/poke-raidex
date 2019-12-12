// @flow

import UserModel from '../models/User';

export async function comparePassword(userName: string, password: string) {
  const user = await UserModel
    .findOne({
      user: userName.trim().toLowerCase(),
    })
    .select('password');

  if (!user) {
    throw Error('The username does not exist');
  }

  if (!(await user.comparePassword(password))) {
    throw Error('The password is invalid');
  }

  return UserModel.findOne({
    user: userName.trim().toLowerCase(),
  });
}

export async function isConnected(session: Object) {
  if (!session.user) {
    throw Error('Not connected');
  }
  return session.user;
}
