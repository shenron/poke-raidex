// @flow

import { Router } from 'express';
import {
  setIsActive,
  getUsers,
  setType,
  getTypes,
} from '@/controllers/user';
import { addRaidEx, updateRaidExDate } from '@/controllers/raidEx';
import { controllerHandler } from '@/_base/utils';

const router: Router<> = Router();
const c = controllerHandler;

router.get('/users', c(getUsers));
router.get('/users/types', c(getTypes));
router.put('/users/:id/type/:type', c(setType, (req) => [req.params.id, req.params.type]));
router.put('/users/:id/enable', c(setIsActive, (req) => [req.params.id, true]));
router.put('/users/:id/disable', c(setIsActive, (req) => [req.params.id, false]));
router.post('/raidex', c(addRaidEx, (req) => [req.body.raidEx]));
router.put('/raidex/:id/date', c(updateRaidExDate, (req) => [req.params.id, {
  start: req.body.start,
  end: req.body.end,
  hour: req.body.jour,
}]));

export default router;
