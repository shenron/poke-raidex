// @flow

import express from 'express';

const router = express.Router();

router.use((req: express$Request, res: express$Response, next: express$NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Accept, Origin, Content-Type, Cookie');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

router.use((req: express$Request & { session: Object }, res: express$Response, next: express$NextFunction) => {
  req.session.userGroup = req.session.userGroup || 'admin';
  next();
});

export default router;
