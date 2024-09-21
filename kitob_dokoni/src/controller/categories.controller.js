import { Router } from "express";
import AuthGuard from "../common/guards/auth.guard.js";
import {
  add,
  getAll,
  getId,
  remove,
  update,
} from "../core/categories/categories.service.js";
import accessControl from "../common/middleware/access-control.middleware.js";

const categorierRouter = Router();

categorierRouter.post("/", AuthGuard, accessControl("Admin"), add);
categorierRouter.get("/",  getAll);
categorierRouter.get("/:id", getId);
categorierRouter.put("/:id", AuthGuard, accessControl("Admin"), update);
categorierRouter.delete("/:id", AuthGuard, accessControl("Admin"), remove);

export default categorierRouter;
