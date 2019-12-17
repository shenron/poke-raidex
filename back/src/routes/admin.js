// @flow

import { Router } from 'express';
import { setIsActive, getUsers } from '@/controllers/user';
import { addRaidEx } from '@/controllers/raidEx';
import { controllerHandler } from '@/_base/utils';

const router: Router<> = Router();
const c = controllerHandler;

router.get('/users', c(getUsers));
router.put('/users/:id/enable', c(setIsActive, (req) => [req.params.id, true]));
router.put('/users/:id/disable', c(setIsActive, (req) => [req.params.id, false]));
router.post('/raidex', c(addRaidEx, (req) => [req.body.raidEx]));

export default router;
