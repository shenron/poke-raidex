// @flow

import { Router } from 'express';

const router: Router<> = Router();

/**
 * Express middleware to protect route
 */
router.use((req: { ...express$Request, session?: Object }, res: express$Response, next: express$NextFunction) => {
  if (req.session && req.session.user) {
    return next();
  }

  throw Error('User not connected');
});

export default router;
