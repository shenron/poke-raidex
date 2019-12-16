// @flow

import User from '@/models/User';

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
