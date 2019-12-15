// @flow

import { Router } from 'express';
import { getTeams, getEventTypes, getAreas } from '@/controllers/browses';
import { controllerHandler } from '@/_base/utils';

const router: Router<> = Router();
const c = controllerHandler;

router.get('/teams', c(getTeams));
router.get('/raidex-types', c(getEventTypes));
router.get('/areas', c(getAreas));

export default router;
