// @flow

import { Router } from 'express';
import {
  getRaidExList,
  getRaidEx,
  deleteRaidEx,
  addSubscription,
} from '@/controllers/raidEx';
import { controllerHandler } from '@/_base/utils';

const router: Router<> = Router();
const c = controllerHandler;

router.get('/', c(getRaidExList));
router.get('/:id', c(getRaidEx, (req) => [req.params.id]));
router.post('/:id/subscription', c(addSubscription, (req) => [req.params.id, req.body.users]));
router.delete('/:id', c(deleteRaidEx, (req) => [req.param.id]));

export default router;
