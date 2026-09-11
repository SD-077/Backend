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

export const getAllPosts: RequestHandler<{}, PostDTO[]> = async (_req, res, next) => {
  try {
    const posts = await Post.find().populate('author', 'firstName lastName email').lean();
    res.json(posts);
  } catch (error) {
    next(error instanceof Error ? error : new Error('Internal server error'));
  }
};

export const createPost: RequestHandler<{}, PostDTO, PostInputDTO> = async (req, res, next) => {
  try {
    const newPost = await Post.create({ ...req.body, author: req.user!.id } satisfies PostInputDTO);
    res.status(201).json(newPost);
  } catch (error) {
    next(error instanceof Error ? error : new Error('Internal server error'));
  }
};

export const getSinglePost: RequestHandler<IdParams, PostDTO> = async (req, res, next) => {
  try {
    const {
      params: { id }
    } = req;
    if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: { status: 400 } });
    const post = await Post.findById(id).populate('author', 'firstName lastName email').lean();
    if (!post) throw new Error(`Post with id of ${id} doesn't exist`, { cause: { status: 404 } });
    res.send(post);
  } catch (error) {
    next(error instanceof Error ? error : new Error('Internal server error'));
  }
};

export const updatePost: RequestHandler<IdParams, PostDTO> = async (req, res, next) => {
  try {
    const {
      body: { title, content, image },
      post
    } = req;
    //req.body.title
    // req.post is what the authorize middleware adds
    if (!post) throw new Error(`Post not found`, { cause: { status: 404 } });

    post.title = title;
    post.content = content;
    post.image = image;
    await post.save();

    res.json(post);
  } catch (error) {
    next(error instanceof Error ? error : new Error('Internal server error'));
  }
};

export const deletePost: RequestHandler<IdParams, { message: string }> = async (req, res, next) => {
  try {
    const {
      params: { id },
      post
    } = req;
    if (!post) throw new Error(`Post not found`, { cause: { status: 404 } });

    await Post.findByIdAndDelete(id);

    res.json({ message: `Post with id of ${id} was deleted` });
  } catch (error) {
    next(error instanceof Error ? error : new Error('Internal server error'));
  }
};
