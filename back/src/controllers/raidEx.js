// @flow

import type { RaidExType } from '@/models/RaidEx';
import EventType from '@/models/EventType';
import RaidEx from '@/models/RaidEx';
import User from '@/models/User';
import Team from '@/models/Team';

export async function getRaidExList() {
  const raidEx = await RaidEx
    .find()
    .populate('type');

  return raidEx.map((r) => ({
    ...r.toObject(),
    type: r.type.id,
  }));
}

export async function getRaidEx(_id: string) {
  const raidEx = await RaidEx
    .findOne({ _id })
    .populate('type');

  return {
    ...raidEx.toObject(),
    type: raidEx.type.id,
  };
}

export async function deleteRaidEx(id: string) {
  return RaidEx.deleteOne({ id });
}

/**
 * Don't use `populate`, keep a copy of user and team
 */
export async function addSubscription(_id: string, users: Array<{| userId: string, teamId: string |}> = [], session: Object) {
  const raidEx = await RaidEx.findOne({ _id });

  const userSubscriptions = raidEx.users.findIndex((u) => u.id === session.user.id);

  const subscriptions = await Promise.all(
    users.map(async (u) => {
      const [resolvedUser, resolvedTeam] = await Promise.all([
        User.findOne({ _id: u.userId }),
        Team.findOne({ _id: u.teamId }),
      ]);

      return {
        userId: resolvedUser._id,
        userName: resolvedUser.user,
        teamId: resolvedTeam._id,
        teamName: resolvedTeam.label,
      };
    }),
  );

  // replace the subscriptions for the found user
  if (userSubscriptions > -1) {
    raidEx.users.splice(userSubscriptions, 1, {
      id: raidEx.users[userSubscriptions].id,
      user: raidEx.users[userSubscriptions].user,
      subscriptions,
    });
    return raidEx.save();
  }

  // push a new user with new subscription
  return RaidEx.findOneAndUpdate(
    { _id },
    {
      $push: {
        users: {
          $each: [{
            id: session.user.id,
            user: session.user.user,
            subscriptions,
          }],
        },
      },
    },
    { new: true },
  );
}

export async function addRaidEx(event: RaidExType) {
  const eventType = await EventType.findOne({ id: event.type });

  const raidEx = {
    ...event,
    type: eventType._id,
  };

  return new RaidEx(raidEx).save();
}
