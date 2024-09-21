import { Router } from "express";
import {
  getAllUsers,
  login,
  register,
  verifyEmail,
} from "../core/user/user.service.js";
import AuthGuard from "../common/guards/auth.guard.js";
import accessControl from "../common/middleware/access-control.middleware.js";

const userRouter = Router();

userRouter.post("/register", AuthGuard, accessControl("Admin"), register);
userRouter.post("/login", login);
userRouter.get("/", AuthGuard, accessControl("Admin"), getAllUsers);
userRouter.get("/verify-email/:token",   verifyEmail);

export default userRouter;
