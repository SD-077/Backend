import type { RequestHandler } from "express";
import { Post } from "#models";

export const getPosts: RequestHandler = async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
};

export const createPost: RequestHandler = async (req, res) => {
  const { title, description, author } = req.body;

  if (!title || !author)
    throw new Error("Title and Author are required!", {
      cause: { status: 400 },
    });

  const post = await Post.create({ title, description, author });

  res.status(201).json(post);
};

export const getPost: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if (!post) throw new Error("Post Not Found", { cause: { status: 404 } });
  res.json(post);
};

export const updatePost: RequestHandler = async (req, res) => {
  // const { id } = req.params;
  // const { email, password } = req.body;
  const {
    body,
    params: { id },
  } = req;

  const post = await Post.findByIdAndUpdate(id, body, {
    returnDocument: "after",
  });

  if (!post) throw new Error("Post Not Found", { cause: { status: 404 } });

  res.json(post);
};

export const deletePost: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByIdAndDelete(id);

  if (!post) throw new Error("Post Not Found", { cause: { status: 404 } });
  res.json(post);
};
