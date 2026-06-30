import { relations, sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const Conversation = pgTable("conversation", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  userId: t.varchar({ length: 256 }).notNull(),
  title: t.varchar({ length: 256 }).notNull().default("New conversation"),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const Message = pgTable("message", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  conversationId: t
    .uuid()
    .notNull()
    .references(() => Conversation.id, { onDelete: "cascade" }),
  role: t.varchar({ length: 32 }).notNull(),
  content: t.text().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
}));

export const ConversationRelations = relations(Conversation, ({ many }) => ({
  messages: many(Message),
}));

export const MessageRelations = relations(Message, ({ one }) => ({
  conversation: one(Conversation, {
    fields: [Message.conversationId],
    references: [Conversation.id],
  }),
}));

export const CreateConversationSchema = createInsertSchema(Conversation, {
  title: z.string().min(1).max(256),
}).pick({ title: true });

export const AppendMessageSchema = createInsertSchema(Message, {
  conversationId: z.string().uuid(),
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1),
}).pick({ conversationId: true, role: true, content: true });
