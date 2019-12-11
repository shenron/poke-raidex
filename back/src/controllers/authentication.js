// @flow

/*
import UserGroup from '../models/UserGroup';

export async function isValid(groupName: string, password: string) {
  const query = UserGroup.findOne({
    name: groupName.trim().toLowerCase(),
  });

  const userGroup = await query.select('+_password');
  if (!userGroup || (userGroup && UserGroup.cryptPassword(password) !== userGroup._password)) {
    throw Error('User name / Password incorrect');
  }

  return true;
}

export async function isConnected(session: Object) {
  if (!session.userGroup) {
    throw Error('Not connected');
  }
  return session.userGroup;
}
*/
