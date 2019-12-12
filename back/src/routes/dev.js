// @flow

import { Router } from 'express';

const router: Router<> = Router();

router.use((req: express$Request, res: express$Response, next: express$NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Accept, Origin, Content-Type, Cookie');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

router.use((req: { ...express$Request, session?: Object }, res: express$Response, next: express$NextFunction) => {
  if (!req.session) {
    req.session = {};
  }
  req.session.type = req.session.type || 'admin';
  next();
});

export default router;
