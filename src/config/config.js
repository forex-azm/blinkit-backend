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
export const authenticate = async (email, password, request) => {
  if (email && password) {
    try {
      const user = await Admin.findOne({ email });
      if (!user) {
        console.warn("User not found");
        return null;
      }

      if (user.password === password) {
        console.log("User authenticated:", user);

        // Check if session is available
        if (!request.session) {
          console.warn("Session not available on request object");
          return { email: user.email, role: user.role }; // Proceed without session
        }

        // Set session data
        request.session.adminUser = { email: user.email, role: user.role };

        // Save the session
        await request.session.save();
        console.log("Session saved:", request.session);

        return { email: user.email, role: user.role };
      } else {
        console.warn("Invalid password");
        return null;
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      return null;
    }
  }

  console.warn("Email or password missing");
  return null;
};
export const PORT = process.env.PORT || 4000;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;
