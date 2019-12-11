// @flow

import User from '../models/User';

const initGroups = async () => Promise.all([{
  name: 'admin',
  password: 'admin',
}].map(async (user) => {
  const query = User.findOne({ name: user.name });

  if (!(await query.exec())) {
    return new User(user).save();
  }

  return true;
}));

export default initGroups;

export { initGroups };
