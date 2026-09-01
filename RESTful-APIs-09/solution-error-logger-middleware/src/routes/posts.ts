import { Router } from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "#controllers";

const postRouter = Router();

postRouter.route("/").get(getPosts).post(createPost);
postRouter.route("/:id").get(getPost).put(updatePost).delete(deletePost);

export default postRouter;
