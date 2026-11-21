import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const globalForMongo = globalThis;
const client = (globalForMongo._mlMongo ||= new MongoClient(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"));
const db = client.db(process.env.DB_NAME || "mentorlagbe");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.BETTER_AUTH_URL].filter(Boolean),
  emailAndPassword: { enabled: true, minPasswordLength: 6 },
  // BetterAuth users live in the "users" collection (the project's collection #1)
  user: {
    modelName: "users",
    additionalFields: {
      role: { type: "string", defaultValue: "student", input: true },
      plan: { type: "string", defaultValue: "free", input: false },
      phone: { type: "string", required: false },
      bio: { type: "string", required: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // only student/tutor can be chosen at sign-up; plan always starts as free
        before: async (user) => ({
          data: { ...user, role: user.role === "tutor" ? "tutor" : "student", plan: "free" },
        }),
      },
      update: {
        // nobody can promote themselves or change their plan via the profile endpoint
        before: async (data) => ("role" in data || "plan" in data ? false : { data }),
      },
    },
  },
});
