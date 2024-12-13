import "dotenv/config";
import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";
import { Admin } from "../models/index.js";

const MongoDBStore = ConnectMongoDBSession(fastifySession);

export const sessionStore = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
  connectionOptions: {
    serverSelectionTimeoutMS: 30000,
  },
});

sessionStore.on("error", (error) => {
  console.log("session store error", error);
});
sessionStore.on("connected", () => {
  console.log("MongoDB session store connected successfully");
});
export const authenticate = async (request, email, password) => {
  if (email && password) {
    try {
      const user = await Admin.findOne({ email });
      if (!user) {
        return null;
      }

      if (user.password === password) {
        console.log("User authenticated:", user);

        // Set session data
        if (request && request.session) {
          request.session.adminUser = { email: user.email, role: user.role };

          // Log session data to verify creation
          console.log("Session data after authentication:", request.session);
        } else {
          console.warn("Session not available on request object");
        }

        return { email: user.email, role: user.role };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      return null;
    }
  }
  return null;
};

export const PORT = process.env.PORT || 4000;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;
