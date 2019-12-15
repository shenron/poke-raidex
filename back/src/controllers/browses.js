// @flow

import Team from '@/models/Team';
import EventType from '@/models/EventType';
import Area from '@/models/Area';

export async function getTeams() {
  return Team.find();
}

export async function getEventTypes() {
  return EventType.find();
}

export async function getAreas() {
  return Area.find();
}
