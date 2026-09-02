import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "#controllers";
import { validateBody } from "#middlewares";
import { userInputSchema } from "#schemas";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.post("/", validateBody(userInputSchema), createUser);
userRouter.get("/:id", getUser);
userRouter.put("/:id", validateBody(userInputSchema), updateUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;
