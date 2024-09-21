import { Router } from "express";
import {
  loginUser,
  registerUser,
  renderLogin,
  renderRegister,
} from "../core/user/user.service.js";

const userRouter = Router();

userRouter.get("/register", renderRegister);
userRouter.get("/login", renderLogin);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/recover-password/:token", (req, res) => {
  res.send("parolni tiklash ...");
});

export default userRouter;
