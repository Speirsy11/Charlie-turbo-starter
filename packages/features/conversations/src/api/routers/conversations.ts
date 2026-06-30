import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { and, asc, desc, eq } from "@charlie/db";

import {
  AppendMessageSchema,
  Conversation,
  CreateConversationSchema,
  Message,
} from "../../db/schema";
import { protectedProcedure } from "../trpc";

export const conversationsRouter = {
  list: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.Conversation.findMany({
      where: eq(Conversation.userId, ctx.auth.userId),
      orderBy: desc(Conversation.createdAt),
      limit: 50,
    }),
  ),

  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const conversation = await ctx.db.query.Conversation.findFirst({
        where: and(
          eq(Conversation.id, input.id),
          eq(Conversation.userId, ctx.auth.userId),
        ),
        with: { messages: { orderBy: asc(Message.createdAt) } },
      });
      if (!conversation) throw new TRPCError({ code: "NOT_FOUND" });
      return conversation;
    }),

  create: protectedProcedure
    .input(CreateConversationSchema.partial())
    .mutation(async ({ ctx, input }) => {
      const [conversation] = await ctx.db
        .insert(Conversation)
        .values({
          userId: ctx.auth.userId,
          title: input.title ?? "New conversation",
        })
        .returning();
      return conversation;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(({ ctx, input }) =>
      ctx.db
        .delete(Conversation)
        .where(
          and(
            eq(Conversation.id, input.id),
            eq(Conversation.userId, ctx.auth.userId),
          ),
        ),
    ),

  appendMessage: protectedProcedure
    .input(AppendMessageSchema)
    .mutation(({ ctx, input }) => ctx.db.insert(Message).values(input)),
} satisfies TRPCRouterRecord;
