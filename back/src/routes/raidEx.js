// @flow

import { Router } from 'express';
import { getRaidExList, deleteRaidEx } from '@/controllers/raidEx';
import { controllerHandler } from '@/_base/utils';

const router: Router<> = Router();
const c = controllerHandler;

router.get('/', c(getRaidExList));
router.delete('/:id', c(deleteRaidEx, (req) => [req.param.id]));

export default router;
