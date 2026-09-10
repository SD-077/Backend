import type { RequestHandler } from 'express';

const authorize = (...allowedRoles: string[]): RequestHandler => {
  return async (req, _res, next) => {
    if (!req.user) return next(new Error('Unauthorized', { cause: { status: 401 } }));
    const { roles, id } = req.user;
    console.log(roles, id);
    if (roles.includes('admin')) {
      return next();
    }
    // i need the post id ???
    // i need the post ?
    // // I need to check the post.author.id if its the same as the req.user.id
    // TODO
    /*
    * Call next with an error if no user property is found on the request object with an early return (throwing the error would also work)
    If the user's roles includes admin, they are allowed to do everything, so call next() right away
    If the allowed roles includes self, we need to query the database for the post, and compare it to the user's id
    Call next() with an error and an early return if they don't match
    Call next() because all checks have been passed
    */
    next();
  };
};
export default authorize;
