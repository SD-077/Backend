import express from "express";
import "#db";
import { userRouter, postRouter } from "#routes";
import { logger, errorHandler } from "#middlewares";

const app = express();
const port = 3000;

app.use(express.json());
app.use(logger);

app.use("/users", userRouter);
app.use("/posts", postRouter);

app.use("/*splat", (req, res) => {
  throw new Error(`Path ${req.url} Not Found`, { cause: { status: 404 } });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
