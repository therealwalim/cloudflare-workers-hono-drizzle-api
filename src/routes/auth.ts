import { Hono } from "hono";
import { genSaltSync, hashSync, compareSync } from "bcrypt-ts";
import { sign as signJWT } from "hono/jwt";
import { deleteCookie, setCookie } from "hono/cookie";
import { drizzle } from "drizzle-orm/d1";
import { Env } from "../types";
import { users } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { userSchema } from "../validators/user";

const app = new Hono<{ Bindings: Env }>();

const hashPassword = (hash: string) => {
  const salt = genSaltSync(10);
  return hashSync(hash, salt);
};

// Register
app.post("/register", zValidator("json", userSchema), async (c) => {
  const db = drizzle(c.env.DB);

  const { name, password, email, age, position } = c.req.valid("json");

  const hashPass = hashPassword(password);

  const [res] = await db
    .insert(users)
    // @ts-ignore
    .values({ name, password: hashPass, email, age, position })
    .returning();

  return c.json({ status: "201", user: res });
});

// Logout
app.post("/login", async (c) => {
  const db = drizzle(c.env.DB);

  const { email, password } = await c.req.json();

  const [user]: any = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (user.length === 0) {
    return c.json({
      status: "404",
      message: `User with email ${email} not found`,
    });
  }

  const payload: any = {
    id: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 20,
  };

  const match = compareSync(password, user.password);

  const secretKey = c.env.JWT_SECRET as string;

  const token = await signJWT(payload, secretKey);

  if (!match) {
    return c.json({ status: "401", message: "Password incorrect" });
  } else {
    setCookie(c, "auth_token", token, {
      secure: true,
      httpOnly: true,
    });

    await db
      .update(users)
      .set({ last_login_at: sql`CURRENT_TIMESTAMP` })
      .where(eq(users.id, user.id));

    return c.json({
      message: "You got successfully logged in",
      data: payload,
      token: token,
    });
  }
});

// Logout
app.delete("/logout", async (c) => {
  deleteCookie(c, "auth_token");

  return c.json({ status: "200", message: "You got successfully logged out" });
});

export default app;
