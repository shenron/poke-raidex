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

export async function updateAccount(id: string, name: string, session: Object) {
  const promises = [];

  // test if user is a sub-accounts of current user
  const sessionSubAccountI = session.user.accounts.findIndex((account) => account.id === id);
  if (sessionSubAccountI > -1) {
    session.user.accounts[sessionSubAccountI].label = name;
  }

  let userModel;
  try {
    userModel = await User.findOne({ _id: id });
    userModel.user = name;
    promises.push(userModel.save());
  } catch (e) {
    throw Error('User Not Found');
  }

  // retrieve all raid-ex with this user
  const userId = new ObjectId(id);
  const raidExModels = await RaidEx.find({
    'users.id': session.user.id,
    'users.subscriptions.userId': userId,
  });

  if (raidExModels.length) {
    promises.push(...raidExModels.map((raidExModel) => {
      const userI = raidExModel.users.findIndex((u) => u.id === session.user.id);
      const subscriptionI = raidExModel.users[userI].subscriptions.findIndex(
        (u) => u.userId.toString() === userId.toString(),
      );

      const userSubscription = raidExModel.users[userI].subscriptions[subscriptionI];
      userSubscription.userId = new ObjectId(id);
      userSubscription.userName = name;

      raidExModel.users[userI].subscriptions.splice(subscriptionI, 1, userSubscription);
      raidExModel.users.splice(userI, 1, raidExModel.users[userI]);

      return raidExModel.save();
    }));
  }

  return Promise.all(promises);
}

/**
 * Try the login before update
 */
export async function updateUser(user: {| oldPassword: string, password: string, user: string |}, session: Object) {
  let userModel;
  if (user.password) {
    userModel = await User
      .findOne({
        _id: session.user.id,
        isActive: true,
        isMainAccount: true,
      })
      .select('password');

    if (!(await userModel.comparePassword(user.oldPassword))) {
      throw Error('The password is invalid');
    }
  } else {
    userModel = await User.findOne({ _id: session.user.id });
  }

  userModel.user = user.user;
  userModel.password = user.password;

  session.user.user = user;

  await Promise.all([
    userModel.save(),
    updateAccount(session.user.id, user.user, session),
  ]);

  return true;
}

export async function deleteAccount(id: string, session: Object) {
  const promises = [];

  const userModel = await User.findOne({ _id: session.user.id });

  // remove it from the child list
  const pos = userModel.accounts.find((account) => account === id);
  if (pos === -1) {
    throw Error('Account Not Found');
  }

  userModel.accounts.splice(pos, 1);
  promises.push(userModel.save());

  // remove all subscriptions with this user of next events
  const userId = new ObjectId(id);
  const raidExModels = await RaidEx.find({
    isFinished: false, // keep history
    'users.id': session.user.id,
    'users.subscriptions.userId': userId,
  });

  if (raidExModels.length) {
    promises.push(...raidExModels.map((raidExModel) => {
      const userI = raidExModel.users.findIndex((u) => u.id === session.user.id);
      const subscriptionI = raidExModel.users[userI].subscriptions.findIndex(
        (u) => u.userId.toString() === userId.toString(),
      );

      raidExModel.users[userI].subscriptions.splice(subscriptionI, 1);
      raidExModel.users.splice(userI, 1, raidExModel.users[userI]);

      return raidExModel.save();
    }));
  }

  // remove user
  promises.push(User.deleteOne({ _id: id }));

  // update the session
  const sessionSubAccountI = session.user.accounts.findIndex((account) => account.id === id);
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
