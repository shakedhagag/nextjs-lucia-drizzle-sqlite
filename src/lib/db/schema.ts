import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  email: text("email").unique(),
  emailVerified: integer("email_verified", { mode: "timestamp" }),
});

export const sessions = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .unique()
    .notNull(),
  expiresAt: integer("expires_at").notNull(),
});

export type User = typeof users.$inferSelect;
