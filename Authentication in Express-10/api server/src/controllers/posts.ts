import type { RequestHandler } from 'express';
import { isValidObjectId, type Types } from 'mongoose';
import type { z } from 'zod';
import type { postSchema } from '#schemas';
import { Post } from '#models';

type PostInputDTO = z.infer<typeof postSchema> & {
  author: string;
};
type PostDTO = Omit<PostInputDTO, 'author'> & {
  _id: InstanceType<typeof Types.ObjectId>;
  author: InstanceType<typeof Types.ObjectId>;
  updatedAt: Date;
  createdAt: Date;
  __v: number;
};

type IdParams = { id: string };

export const getAllPosts: RequestHandler<{}, PostDTO[]> = async (_req, res) => {
  try {
    const posts = await Post.find().populate('author', 'firstName lastName email').lean();
    res.json(posts);
  } catch (error) {
    console.log(error);
  }
};

export const createPost: RequestHandler<{}, PostDTO, PostInputDTO> = async (req, res) => {
  const newPost = await Post.create({ ...req.body, author: req.user!.id } satisfies PostInputDTO);
  res.status(201).json(newPost);
};

export const getSinglePost: RequestHandler<IdParams, PostDTO> = async (req, res) => {
  const {
    params: { id }
  } = req;
  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: { status: 400 } });
  const post = await Post.findById(id).populate('author', 'firstName lastName email').lean();
  if (!post) throw new Error(`Post with id of ${id} doesn't exist`, { cause: { status: 404 } });
  res.send(post);
};

export const updatePost: RequestHandler<IdParams, PostDTO> = async (req, res) => {
  const {
    params: { id }
  } = req;
  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: { status: 400 } });
  const updatedPost = await Post.findByIdAndUpdate(id, req.body, { returnDocument: 'after' });
  if (!updatedPost) throw new Error(`Post with id of ${id} doesn't exist`, { cause: { status: 404 } });
  res.json(updatedPost);
};

export const deletePost: RequestHandler<IdParams, { message: string }> = async (req, res) => {
  const {
    params: { id }
  } = req;
  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: { status: 400 } });
  const deletedPost = await Post.findByIdAndDelete(id);
  if (!deletedPost) throw new Error(`Post with id of ${id} doesn't exist`, { cause: { status: 404 } });
  res.json({ message: `Post with id of ${id} was deleted` });
};
