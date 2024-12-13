import "dotenv/config";
import Fastify from "fastify";
import { connectDB } from "./src/config/connect.js";
import { PORT } from "./src/config/config.js";
import { admin, buildAdminRouter } from "./src/config/setup.js";
import { registerRoutes } from "./src/routes/index.js";
import fastifySocketIO from "fastify-socket.io";
import { Socket } from "socket.io";

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  const app = Fastify();
  app.addHook("onRequest", async (request, reply) => {
  console.log("Incoming request session:", request.session);
});

app.addHook("preHandler", async (request, reply) => {
  console.log("Pre-handler session state:", request.session);
});

app.addHook("onSend", async (request, reply, payload) => {
  console.log("Outgoing response session:", request.session);
});
  app.register(fastifySocketIO, {
    cors: {
      origin: "*",
    },
    pingInterval: 10000,
    pingTimeout: 5000,
    transports: ["websocket"],
  });
  await registerRoutes(app);
  await buildAdminRouter(app);
  app.listen({ port: PORT, host: "0.0.0.0" }, (err, addr) => {
    if (err) {
      console.log(err);
    } else {
      console.log(
        `Blinkit Started on http://localhost:${PORT}${admin.options.rootPath}`
      );
    }
  });
  app.ready().then(() => {
    app.io.on("connection", (socket) => {
      console.log("A User Connected");
      socket.on("joinRoom", (orderId) => {
        socket.join(orderId);
        console.log(`User joined room: ${orderId}`);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  });
};
start();
