import "server-only";

import type { UIMessage } from "ai";
import { auth } from "@clerk/nextjs/server";

import { streamChat } from "@charlie/chat/server";

import { db } from "../db/client";
import { Message } from "../db/schema";

interface ChatRequestBody {
  conversationId: string;
  messages: UIMessage[];
}

/** Flatten an AI SDK UIMessage's text parts into a single string for storage. */
function uiMessageText(message: UIMessage): string {
  return message.parts
    .filter(
      (part): part is { type: "text"; text: string } => part.type === "text",
    )
    .map((part) => part.text)
    .join("");
}

/**
 * The Next.js route handler behind `/api/conversations/chat`. Persists the
 * latest user turn, streams a Claude response via the chat service, and saves
 * the assistant turn when the stream finishes. Mounted by the app; the feature
 * owns the logic so persistence stays next to the schema.
 */
export async function chatHandler(req: Request): Promise<Response> {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { conversationId, messages } = (await req.json()) as ChatRequestBody;

  const latest = messages.at(-1);
  if (latest?.role === "user") {
    await db.insert(Message).values({
      conversationId,
      role: "user",
      content: uiMessageText(latest),
    });
  }

  const result = streamChat({ messages });

  return result.toUIMessageStreamResponse({
    onFinish: async ({ responseMessage }) => {
      await db.insert(Message).values({
        conversationId,
        role: "assistant",
        content: uiMessageText(responseMessage),
      });
    },
  });
}
