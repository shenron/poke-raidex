// @flow

import UserModel from '../models/User';

export async function login(userName: string, password: string, session: Object) {
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

  session.user = (await UserModel.findOne({
    user: userName.trim().toLowerCase(),
  })).toObject();

  return session.user;
}

export async function isConnected(session: Object) {
  if (!session.user) {
    throw Error('Not connected');
  }
  return session.user;
}

export async function logOff(session: Object) {
  session.user = null;
}
