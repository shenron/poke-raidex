// @flow

import { model, Schema } from 'mongoose';

const serialize = {
  // to display `id`
  virtuals: true,
  transform(doc, eventType) {
    delete eventType._id;
  },
  // exclude `_v`
  versionKey: false,
};

const schema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  label: {
    type: String,
    unique: false,
    required: true,
  },
}, {
  toJSON: serialize,
  toObject: serialize,
});

export default model('EventType', schema);
