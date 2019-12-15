// @flow

import { model, Schema } from 'mongoose';

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
  label: {
    type: String,
    unique: false,
    required: true,
  },
  color: {
    type: String,
    unique: true,
    required: true,
  },
}, {
  toJSON: serialize,
  toObject: serialize,
});

export default model('Team', schema);
