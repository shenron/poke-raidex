// @flow

import User from '../models/User';
import EventType from '../models/EventType';
import Team from '../models/Team';
import Area from '../models/Area';

const init = async () => Promise.all([
  ...[
    {
      user: 'admin',
      password: process.env.ADMIN_PWD || 'admin',
      type: 'ADMIN',
      isMainAccount: true,
      isActive: true,
      accounts: [],
    },
  ].map(async (user) => {
    const query = User.findOne({ user: user.user });

    if (!(await query.exec())) {
      return new User(user).save();
    }
    return true;
  }),
  ...[
    {
      id: 'INFO',
      label: 'Information',
    },
    {
      id: 'DEFAULT',
      label: 'Inscription',
    },
  ].map(async (eventType) => {
    const query = EventType.findOne({ id: eventType.id });

    if (!await query.exec()) {
      return new EventType(eventType).save();
    }
    return true;
  }),
  ...[
    { label: 'Bravoure', color: 'red' },
    { label: 'Sagesse', color: 'blue' },
    { label: 'Instinct', color: 'yellow' },
  ].map(async (team) => {
    const query = Team.findOne({ color: team.color });

    if (!await query.exec()) {
      return new Team(team).save();
    }
    return true;
  }),
  ...[
    { label: 'Chaudron' },
    { label: 'Princesse Pauline' },
    { label: 'Mougins' },
  ].map(async (area) => {
    const query = Area.findOne({ label: area.label });

    if (!await query.exec()) {
      return new Area(area).save();
    }
    return true;
  }),
]);

export default init;
