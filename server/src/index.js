import { app } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";

const start = async () => {
  await connectDb();
  app.listen(env.port, () => {
    console.log(`Mini Burp Suite API listening on http://localhost:${env.port}`);
  });
};

start().catch((error) => {
  console.error("Server failed to start", error);
  process.exit(1);
});

