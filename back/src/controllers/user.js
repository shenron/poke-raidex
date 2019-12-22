// @flow

import { Types } from 'mongoose';
import User from '@/models/User';
import RaidEx from '@/models/RaidEx';

const { ObjectId } = Types;

export async function getUsers() {
  return User
    .find({
      isMainAccount: true,
    })
    .populate('accounts');
}

export async function isAvailableUser(userName: string) {
  const user = await User.findOne({
    user: userName,
  });

  return !user;
}

export async function addUser(user: string, password: string, accounts: Array<string>) {
  const isActive = false;
  const type = 'DEFAULT';

  const subAccountIds = await Promise.all(
    accounts.map(async (account) => {
      const subAccount = new User({
        user: account,
        password,
        isActive,
        type,
        isMainAccount: false,
        accounts: [],
      });

      await subAccount.save();
      return subAccount._id;
    }),
  );

  const userModel = new User({
    user,
    password,
    isActive,
    isMainAccount: true,
    type,
    accounts: subAccountIds,
  });

  await userModel.save();

  return userModel.toObject();
}

export async function setIsActive(id: string, isActive: boolean) {
  const user = await User.findOne({
    _id: id,
  });

  user.isActive = isActive;

  await user.save();
  return true;
}

export async function deleteSubAccount(id: string, session: Object) {
  const promises = [];

  // test if user is a sub-accounts of current user
  const sessionSubAccountI = session.user.accounts.findIndex((account) => account.id === id);
  if (sessionSubAccountI === -1) {
    throw Error('Not allowed to delete this user');
  }

  let userModel;
  try {
    userModel = await User.findOne({ _id: session.user.id });
  } catch (e) {
    throw Error('User Not Found');
  }

  // remove it from the child list
  const pos = userModel.accounts.find((account) => account === id);
  if (pos === -1) {
    throw Error('Account Not Found');
  }

  userModel.accounts.splice(pos, 1);
  promises.push(userModel.save());

  // remove all subscriptions with this user of next events
  const userId = new ObjectId(id);
  const raidExModel = await RaidEx.findOne({
    isFinished: false, // keep history
    'users.id': session.user.id,
    'users.subscriptions.userId': userId,
  });

  if (raidExModel) {
    const userI = raidExModel.users.findIndex((u) => u.id === session.user.id);
    const subscriptionI = raidExModel.users[userI].subscriptions.findIndex(
      (u) => u.userId.toString() === userId.toString(),
    );

    raidExModel.users[userI].subscriptions.splice(subscriptionI, 1);
    raidExModel.users.splice(userI, 1, raidExModel.users[userI]);

    promises.push(raidExModel.save());
  }

  // remove user
  promises.push(User.deleteOne({ _id: id }));

  // update the session
  session.user.accounts.splice(sessionSubAccountI, 1);

  return Promise.all(promises);
}

export async function addSubAccount(user: string, session: Object) {
  const subAccount = new User({
    user,
    isActive: false,
    isMainAccount: false,
    type: 'DEFAULT',
  });

  const currentUser = await User.findOne({
    _id: session.user.id,
  });

  currentUser.accounts.push(subAccount._id);

  await Promise.all([
    subAccount.save(),
    currentUser.save(),
  ]);

  const newSubAccount = {
    id: subAccount._id.toString(),
    label: user,
  };

  // update the session
  session.user.accounts.push(newSubAccount);

  return newSubAccount;
}
