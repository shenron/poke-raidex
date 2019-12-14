// @flow

import { Router } from 'express';
import {
  login,
  isConnected,
  logOff,
} from '@/controllers/authentication';
import {
  isAvailableUser,
  addUser,
} from '@/controllers/user';
import { controllerHandler } from '@/_base/utils';

const router: Router<> = Router();

const c = controllerHandler;

// try to log the user
router.post('/', c(login, (req) => [req.body.user, req.body.password]));

// if connected return `user`, else throw error
router.get('/', c(isConnected));

// logoff
router.delete('/', c(logOff));

// test if a user name exist
router.get('/:userName/available', c(isAvailableUser, (req) => [req.params.userName]));

// insert a user and his accounts
router.post('/user', c(addUser, (req) => [req.body.user, req.body.password, req.body.accounts]));

export default router;
