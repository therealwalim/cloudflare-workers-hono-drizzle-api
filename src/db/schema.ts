import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name", { length: 100 }).notNull(),
  password: text("password", { length: 100 }).notNull(),
  avatar: text("avatar", { length: 100 }),
  email: text("email", { length: 50 }).unique().notNull(),
  age: integer("age", { mode: "number" }).notNull(),
  position: text("position", { length: 50 }),
  password_changed_at: text("password_changed_at").default(
    sql`CURRENT_TIMESTAMP`
  ),
  last_login_at: text("last_login")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  last_logout_at: text("last_logout").default(sql`CURRENT_TIMESTAMP`),
  is_active: integer("is_active").default(0).notNull(),
  is_deleted: integer("is_deleted").default(0).notNull(),
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
