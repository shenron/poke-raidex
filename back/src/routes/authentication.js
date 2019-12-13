// @flow

import { Router } from 'express';
import { login, isConnected, logOff } from '@/controllers/authentication';
import { controllerHandler } from '@/_base/utils';

const router: Router<> = Router();

const c = controllerHandler;

router.post('/', c(async (user: string, password: string, session: Object) => {
  try {
    return login(user, password, session);
  } catch (e) {
    throw Error(e);
  }
}, (req) => [req.body.user, req.body.password]));

// if connected return `user`, else throw error
router.get('/', c(isConnected));

router.delete('/', c(logOff));

export default router;
