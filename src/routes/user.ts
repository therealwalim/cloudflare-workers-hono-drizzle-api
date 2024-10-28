import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

import { eq, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { v4 as uuidv4 } from "uuid";

import { users } from "../db/schema";
import { Env } from "../types";

const user = new Hono<{ Bindings: Env }>();

// ** middleware
user.use("/*", async (_, next) => {
  try {
    const token = getCookie(_, "auth_token");
    const secretKey = _.env.JWT_SECRET as string;

    if (!token) {
      return _.json({ message: "token not found" }, 404);
    }

    const payload = await verify(token, secretKey);

    if (!payload) {
      return _.json({ message: "token expired" }, 401);
    }
    await next();
  } catch (error) {
    return _.json({ message: "Unauthorized" }, 401);
  }
});

// ** GET /users
user.get("/", async (c) => {
  const db = drizzle(c.env.DB);

  const q = c.req.query("q");

  let query: any = db.select().from(users);

  if (q) {
    query = query.where(like(users.name, "%" + q + "%"));
  }

  const items = await query;

  return c.json({ status: "200", items });
});

// ** GET /users/:id
user.get("/:id", async (c) => {
  const db = drizzle(c.env.DB);
  const userId = parseInt(c.req.param("id"), 10);
  const [item] = await db.select().from(users).where(eq(users.id, userId));
  return c.json({ status: "200", item });
});

// ** PATCH /users/:id
user.patch("/:id", async (c) => {
  const db = drizzle(c.env.DB);
  const body: any = await c.req.json();
  const userId = parseInt(c.req.param("id"), 10);
  const res = await db.update(users).set(body).where(eq(users.id, userId));
  return c.json({ status: "200", message: "User updated", payload: res });
});

// ** POST /users/:id/avatar
user.post("/:id/avatar", async (c) => {
  try {
    const db: any = drizzle(c.env.DB);

    const body = await c.req.parseBody();
    const bucket = c.env.R2;

    const file = body["avatar"];

    if (file && file instanceof File) {
      const fileName = file.name;
      const key = `${uuidv4()}-${fileName}`;
      const upload = await bucket.put(key, file.stream(), {
        httpMetadata: { contentType: file.type },
      });

      const imageUrl = c.env.R2_PUBLIC_URL + "/" + key;

      await db
        .update(users)
        .set({ avatar: imageUrl })
        .where(eq(users.id, parseInt(c.req.param("id"), 10)));

      // Return success response
      return c.json({ status: "200", url: imageUrl });
    } else {
      return c.json({ status: "400", message: "Invalid file upload" });
    }
  } catch (error) {
    return c.json({ status: "500", message: error });
  }
});

export default user;
