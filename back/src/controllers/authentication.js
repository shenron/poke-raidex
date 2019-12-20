// @flow

import UserModel from '../models/User';

export async function login(userName: string, password: string, session: Object) {
  const userModel = await UserModel
    .findOne({
      user: userName.trim().toLowerCase(),
      isActive: true,
      isMainAccount: true,
    })
    .select('password');

  if (!userModel) {
    throw Error('The username does not exist');
  }

  if (!(await userModel.comparePassword(password))) {
    throw Error('The password is invalid');
  }

  const user = (
    await UserModel.findOne({
      user: userName.trim().toLowerCase(),
    }).populate('accounts')
  ).toObject();

  user.accounts = user.accounts.map((account) => ({
    id: account.id,
    label: account.user,
  }));

  session.user = user;

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
