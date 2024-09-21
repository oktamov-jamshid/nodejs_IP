import { Router } from "express";
import AuthGuard from "../common/guards/auth.guard.js";
import {
  add,
  getAll,
  getId,
  remove,
  update,
} from "../core/publishers/publisher.service.js";
import accessControl from "../common/middleware/access-control.middleware.js";

const publisherRouter = Router();

publisherRouter.post("/", AuthGuard,accessControl("Admin"),  add);
publisherRouter.get("/",  getAll);
publisherRouter.get("/:id", getId);
publisherRouter.put("/:id", AuthGuard,accessControl("Admin"),  update);
publisherRouter.delete("/:id",AuthGuard, accessControl("Admin"),  remove);

export default publisherRouter;
