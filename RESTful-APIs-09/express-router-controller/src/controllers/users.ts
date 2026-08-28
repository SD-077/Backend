import type { RequestHandler } from "express";
import { User } from "#models";

export const getUsers: RequestHandler = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

export const createUser: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).send("Email and password are required!");

  const user = await User.create({ email, password });

  res.status(201).json(user);
};

export const getUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) return res.status(404).send("User Not Found!");
  res.json(user);
};

export const updateUser: RequestHandler = async (req, res) => {
  // const { id } = req.params;
  // const { email, password } = req.body;
  const {
    body,
    params: { id },
  } = req;

  const user = await User.findByIdAndUpdate(id, body, {
    returnDocument: "after",
  });

  if (!user) return res.status(404).send("User Not Found!");

  res.json(user);
};

export const deleteUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) return res.status(404).send("User Not Found!");
  res.json(user);
};
