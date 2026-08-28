import express from "express";
import "#db";
import { userRouter, postRouter } from "#routes";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/users", userRouter);
app.use("/posts", postRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
