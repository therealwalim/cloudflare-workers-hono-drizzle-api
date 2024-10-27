// default
import { Hono } from "hono";
import { showRoutes } from "hono/dev";
// types
import { Env } from "./types";
// routes
import user from "./routes/user";
import auth from "./routes/auth";

const app = new Hono<{ Bindings: Env }>();

app.route("/auth", auth);
app.route("/users", user);

showRoutes(app);

export default app;
