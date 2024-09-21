import { Router } from "express";
import AuthGuard from "../common/guards/auth.guard.js";
import {
  addOrder,
  getAll,
  getOrderId,
  removeOrder,
  updateOrder,
} from "../core/orders/order.service.js";
import accessControl from "../common/middleware/access-control.middleware.js";

const orderRouter = Router();

orderRouter.post("/", AuthGuard,accessControl("User"),  addOrder);
orderRouter.get("/", getAll);
orderRouter.get("/:id", getOrderId);
orderRouter.put("/:id",AuthGuard, accessControl("User"),  updateOrder);
orderRouter.delete("/:id",AuthGuard, accessControl("User"),  removeOrder);

export default orderRouter;
