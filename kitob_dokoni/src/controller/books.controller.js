import { Router } from "express";
import AuthGuard from "../common/guards/auth.guard.js";
import {
  addBook,
  getAll,
  getBookId,
  removeBook,
  updateUser,
} from "../core/books/books.service.js";
import accessControl from "../common/middleware/access-control.middleware.js";

const bookRouter = Router();

bookRouter.post("/", AuthGuard, accessControl("Admin"), addBook);
bookRouter.get("/", getAll);
bookRouter.get("/:id",  getBookId);
bookRouter.put("/:id", AuthGuard, accessControl("Admin"), updateUser);
bookRouter.delete("/:id", AuthGuard, accessControl("Admin"), removeBook);

export default bookRouter;
