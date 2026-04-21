import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const scores = pgTable("scores", {
  id: serial("id").primaryKey(),
  game: text("game").notNull(),
  player: text("player").notNull(),
  score: integer("score").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
