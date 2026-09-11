import type { RequestHandler } from 'express';
import { Post } from '#models';
const authorize = (...allowedRoles: string[]): RequestHandler => {
  return async (req, _res, next) => {
    if (!req.user) return next(new Error('Unauthorized', { cause: { status: 401 } }));
    // renaming the roles and id to userRoles and userId to make it easier to read
    const { roles: userRoles, id: userId } = req.user;

    const { id: postId } = req.params;

    if (!postId) {
      return next(new Error('Post ID parameter is missing', { cause: { status: 400 } }));
    }

    const post = await Post.findById(postId);

    if (!post) {
      return next(new Error('Post not found', { cause: { status: 404 } }));
    }
    req.post = post;

    // Check for standard role match (e.g., 'editor', 'moderator')
    const hasAllowedRole = userRoles.some(role => allowedRoles.includes(role));
    if (hasAllowedRole) {
      return next();
    }
    //Handle 'self' ownership check
    if (allowedRoles.includes('self')) {
      const authorId = post.author?.toString();
      if (authorId !== userId) {
        return next(new Error('Forbidden: You do not own this post', { cause: { status: 403 } }));
      }

      return next();
    }

    // default to forbid access If no checks passed
    return next(new Error('Forbidden: Insufficient permissions', { cause: { status: 403 } }));
  };
};
export default authorize;
