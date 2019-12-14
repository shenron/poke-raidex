// @flow

import User from '../models/User';

const init = async () => Promise.all([{
  user: 'admin',
  password: process.env.ADMIN_PWD || 'admin',
  type: 'ADMIN',
  isMainAccount: true,
  isActive: true,
  accounts: [],
}].map(async (user) => {
  const query = User.findOne({ user: user.user });

  if (!(await query.exec())) {
    return new User(user).save();
  }

  return true;
}));

export default init;
