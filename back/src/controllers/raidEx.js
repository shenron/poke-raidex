// @flow

import type { RaidExType } from '@/models/RaidEx';
import EventType from '@/models/EventType';
import RaidEx from '@/models/RaidEx';

export async function getRaidExList() {
  return RaidEx.find();
}

export async function deleteRaidEx(id: string) {
  return RaidEx.deleteOne({ id });
}

export async function addRaidEx(event: RaidExType) {
  const eventType = await EventType.findOne({ id: event.type });

  const raidEx = {
    ...event,
    type: eventType._id,
  };

  return new RaidEx(raidEx).save();
}
