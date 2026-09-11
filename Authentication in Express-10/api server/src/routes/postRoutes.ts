import { Router } from 'express';
import { authenticate, validateBody, authorize } from '#middleware';
import { createPost, deletePost, getAllPosts, getSinglePost, updatePost } from '#controllers';
import { postSchema } from '#schemas';

const postRoutes = Router();

postRoutes.route('/').get(getAllPosts).post(authenticate, validateBody(postSchema), createPost);

postRoutes
  .route('/:id')
  .get(getSinglePost)
  .put(authenticate, authorize('self', 'admin'), validateBody(postSchema), updatePost)
  .delete(authenticate, authorize('self', 'admin'), deletePost);

export default postRoutes;
