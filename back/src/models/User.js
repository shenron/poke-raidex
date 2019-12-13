// @flow

import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';

const saltRounds = 10;

const serialize = {
  // to display `id`
  virtuals: true,
  transform(doc, user) {
    delete user._id;
  },
  // exclude `_v`
  versionKey: false,
};

const schema = new Schema({
  user: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    unique: false,
    required: true,
    select: false,
  },
  type: {
    type: String,
    unique: false,
    required: true,
  },
  accounts: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
  toJSON: serialize,
  toObject: serialize,
});

schema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, saltRounds);
  return next();
});

schema.methods.comparePassword = async function (plaintext: string) {
  return bcrypt.compare(plaintext, this.password);
};

export default model('User', schema);
