// @flow

import express from 'express';
import {
  getUsers,
} from '@/controllers/user';
import { controllerHandler } from '@/_base/utils';

const router = express.Router();
const c = controllerHandler;

router.get('/', c(getUsers));

export default router;
