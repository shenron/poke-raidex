// @flow

import { Router } from 'express';
import { getUsers } from '@/controllers/user';
import { controllerHandler } from '@/_base/utils';

const router: Router<> = Router();
const c = controllerHandler;

router.get('/', c(getUsers));

export default router;
