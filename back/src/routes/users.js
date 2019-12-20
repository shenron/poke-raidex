// @flow

import { Router } from 'express';
import { getUsers, addSubAccount } from '@/controllers/user';
import { controllerHandler } from '@/_base/utils';

const router: Router<> = Router();
const c = controllerHandler;

router.get('/', c(getUsers));
router.post('/account', c(addSubAccount, (req) => [req.body.user]))

export default router;
