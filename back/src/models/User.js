// @flow

import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';

const saltRounds = 10;

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
});

schema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, saltRounds);
  return next();
});

// to display `id`
schema.set('toJSON', {
  virtuals: true,
});

schema.methods.comparePassword = async function (plaintext: string) {
  return bcrypt.compare(plaintext, this.password);
};

export default model('User', schema);
