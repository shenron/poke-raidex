// @flow

import { Router } from 'express';
import {
  getUsers,
  addSubAccount,
  deleteAccount,
  updateAccount,
  updateUser,
} from '@/controllers/user';
import { controllerHandler } from '@/_base/utils';

const router: Router<> = Router();
const c = controllerHandler;

router.put('', c(updateUser, (req) => [req.body.user]));
router.get('/', c(getUsers));
router.post('/account', c(addSubAccount, (req) => [req.body.user]));
router.put('/accounts/:id/name', c(updateAccount, (req) => [req.params.id, req.body.user]));
router.delete('/accounts/:id', c(deleteAccount, (req) => [req.params.id]));

export default router;
