// @flow

import { Router } from 'express';
import { comparePassword } from '@/controllers/authentication';
import { controllerHandler } from '@/_base/utils';

const router: Router<> = Router();

const c = controllerHandler;

router.post('/', c(async (user: string, password: string) => {
  try {
    return comparePassword(user, password);
  } catch (e) {
    throw Error(e);
  }
}, (req) => [req.body.user, req.body.password]));

// if connected return `user`, else throw error
// router.get('/', c(isConnected));

export default router;
