// @flow

import express from 'express';
import { controllerHandler } from '@/_base/utils';

const router = express.Router();

const c = controllerHandler;

router.post('/', c(async (user: string, password: string, sessionId, session: Object) => {
  try {
    console.log(user, password, sessionId, session);
    // check validity
  } catch (e) {
    throw Error(e);
  }
}, (req) => [req.body.userGroup, req.body.password, req.sessionID]));

// if connected return `userGroup`, else throw error
// router.get('/', c(isConnected));

export default router;
