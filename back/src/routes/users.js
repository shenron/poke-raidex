// @flow

import { Router } from 'express';
import {
  getUsers,
  addSubAccount,
  deleteSubAccount,
  updateSubAccount,
} from '@/controllers/user';
import { controllerHandler } from '@/_base/utils';

const router: Router<> = Router();
const c = controllerHandler;

router.get('/', c(getUsers));
router.post('/account', c(addSubAccount, (req) => [req.body.user]));
router.put('/accounts/:id/name', c(updateSubAccount, (req) => [req.params.id, req.body.user]));
router.delete('/accounts/:id', c(deleteSubAccount, (req) => [req.params.id]));

export default router;
