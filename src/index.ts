// default
import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";

import auth from "./routes/auth";
import user from "./routes/user";
// types
import { Env } from "./types";

const app = new Hono<{ Bindings: Env }>();

// cors
app.use("/*", cors());
// logger
app.use(logger());

app.route("/auth", auth);
app.route("/users", user);

showRoutes(app);

export default app;
