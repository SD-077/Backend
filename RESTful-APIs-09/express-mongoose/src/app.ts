import express from "express";
import "#db";
import { User, Post } from "#models";

const app = express();
const port = 3000;

app.use(express.json());

// USER ENDPOINTS
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).send("Email and password are required!");

  const user = await User.create({ email, password });

  res.status(201).json(user);
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) return res.status(404).send("User Not Found!");
  res.json(user);
});

app.put("/users/:id", async (req, res) => {
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
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) return res.status(404).send("User Not Found!");
  res.json(user);
});

// POST ENDPOINTS
app.get("/posts", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

app.post("/posts", async (req, res) => {
  const { title, description, author } = req.body;

  if (!title || !author)
    return res.status(400).send("Title and Author are required!");

  const post = await Post.create({ title, description, author });

  res.status(201).json(post);
});

app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if (!post) return res.status(404).send("Post Not Found!");
  res.json(post);
});

app.put("/posts/:id", async (req, res) => {
  // const { id } = req.params;
  // const { email, password } = req.body;
  const {
    body,
    params: { id },
  } = req;

  const post = await Post.findByIdAndUpdate(id, body, {
    returnDocument: "after",
  });

  if (!post) return res.status(404).send("Post Not Found!");

  res.json(post);
});

app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByIdAndDelete(id);

  if (!post) return res.status(404).send("Post Not Found!");
  res.json(post);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
