// @flow

import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';

const saltRounds = 10;

const serialize = {
  // to display `id`
  virtuals: true,
  transform(doc, user) {
    delete user._id;
    delete user.password;
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

  // by default an account is not activated, ony the admin can toggle
  isActive: {
    type: Boolean,
    default: false,
  },

  // only main account can logon
  isMainAccount: {
    type: Boolean,
    required: true,
  },
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
