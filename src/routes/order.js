import { verifyToken } from "../../middleware/auth.js";
import {
  confirmOrder,
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from "../controllers/order/order.js";

export const orderRoutes = async (fastify, options) => {
  fastify.addHook("preHandler", async (request, reply) => {
    const isAuthenticated = await verifyToken(request, reply);
    if (!isAuthenticated)
      return reply.status(401).send({ message: "Unauthenticated" });
  });

  fastify.post("/order", createOrder);
  fastify.get("/order", getOrders);
  fastify.patch("/order/:orderId/status", updateOrderStatus);
  fastify.post("/order/:orderId/confirm", confirmOrder);
  fastify.post("/order/:orderId", getOrderById);
};
