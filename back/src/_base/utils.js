// @flow

export const controllerHandler = (promise: Function, params?: Function) => async (
  req: { ...express$Request, session?: { [id: string]: string } },
  res: express$Response,
  next: express$NextFunction,
) => {
  const boundParams = params ? params(req, res, next) : [];
  try {
    const result = await promise(...boundParams.concat([req.session]));
    return res.json(result || { message: 'OK' });
  } catch (error) {
    return res.status(500) && next(error);
  }
};

export const isAdmin = (session: Object) => (session.userGroup.toLowerCase() === 'admin');

/* eslint-disable no-bitwise, no-mixed-operators */
export const generateUUID = () => {
  let d = Date.now();
  let r;

  // have to start by [a-z]
  return 'zxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    r = (d + (Math.random() * 16)) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};
/* eslint-enable no-bitwise, no-mixed-operators */
