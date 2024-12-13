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

export const authenticate = async (email, password) => {
  if (email && password) {
    try {
      const user = await Admin.findOne({ email });

      if (!user) {
        return null;
      }

      if (user.password === password) {
        return Promise.resolve({ email: user.email, password: user.password });
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
