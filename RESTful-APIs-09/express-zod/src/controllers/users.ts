import type { RequestHandler } from "express";
import { User } from "#models";

export const getUsers: RequestHandler = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

export const createUser: RequestHandler = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
};

export const getUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) throw new Error("User Not Found", { cause: { status: 404 } });
  res.json(user);
};

export const updateUser: RequestHandler = async (req, res) => {
  const {
    body,
    params: { id },
  } = req;

  const user = await User.findByIdAndUpdate(id, body, {
    returnDocument: "after",
  });

  if (!user) throw new Error("User Not Found", { cause: { status: 404 } });

  res.json(user);
};

export const deleteUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) throw new Error("User Not Found", { cause: { status: 404 } });
  res.json(user);
};
