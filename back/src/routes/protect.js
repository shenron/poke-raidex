// @flow

import express from 'express';

const router = express.Router();

/**
 * Express middleware to protect route
 */
router.use((req: express$Request & { session: Object }, res: express$Response, next: express$NextFunction) => {
  if (req.session.userGroup) {
    return next();
  }

  throw Error('User not connected');
});

export default router;
