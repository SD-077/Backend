import { Router } from 'express';
import { authenticate, validateBody, authorize } from '#middleware';
import { createPost, deletePost, getAllPosts, getSinglePost, updatePost } from '#controllers';
import { postSchema } from '#schemas';

const postRoutes = Router();

postRoutes.route('/').get(getAllPosts).post(authenticate, authorize('admin'), validateBody(postSchema), createPost);

postRoutes
  .route('/:id')
  .get(getSinglePost)
  .put(authenticate, validateBody(postSchema), updatePost)
  .delete(authenticate, deletePost);

export default postRoutes;
