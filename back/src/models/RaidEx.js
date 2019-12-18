// @flow

import { model, Schema } from 'mongoose';

export type RaidExType = {|
  id: string,
  type: 'INFO' | 'DEFAULT',
  users: Array<{|
    id: string,
    user: string,
    subscriptions: Array<{|
      userId: string,
      userName: string,
      teamId: string,
      teamName: string,
    |}>,
  |}>,
  areaId: string,
  start: string,
  end: string,
|};

const serialize = {
  // to display `id`
  virtuals: true,
  transform(doc, team) {
    delete team._id;
  },
  // exclude `_v`
  versionKey: false,
};

const schema = new Schema({
  type: { type: Schema.Types.ObjectId, ref: 'EventType' },
  areaId: { type: Schema.Types.ObjectId, ref: 'Area' },
  start: {
    type: String,
  },
  end: {
    type: String,
  },
  hour: {
    type: String,
  },
  users: {
    type: Array,
    default: [],
  },
}, {
  toJSON: serialize,
  toObject: serialize,
});

export default model('RaidEx', schema);
