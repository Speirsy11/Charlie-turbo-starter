import "server-only";

import type { UIMessage } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { convertToModelMessages, streamText } from "ai";

import { env } from "../env";
import { chatTools } from "./tools";

const SYSTEM_PROMPT =
  "You are a helpful, concise assistant built into the Charlie Turbo starter. " +
  "Use the available tools when they help answer the user (e.g. for the current time or arithmetic).";

/**
 * Streams a Claude response for a conversation using the Vercel AI SDK. The
 * feature's route handler turns the returned result into a UI message stream
 * response (`toUIMessageStreamResponse()`), so this service stays transport- and
 * persistence-agnostic.
 */
export function streamChat({ messages }: { messages: UIMessage[] }) {
  return streamText({
    model: anthropic(env.ANTHROPIC_MODEL),
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    tools: chatTools,
  });
}
