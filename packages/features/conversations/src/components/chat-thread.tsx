"use client";

import type { UIMessage } from "ai";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useQuery } from "@tanstack/react-query";
import { DefaultChatTransport } from "ai";

import { cn } from "@charlie/ui";
import { Button } from "@charlie/ui/button";
import { Input } from "@charlie/ui/input";

import { useTRPC } from "../trpc/react";

/** Join an AI SDK UIMessage's text parts for display. */
function partsToText(message: UIMessage): string {
  return message.parts
    .filter(
      (part): part is { type: "text"; text: string } => part.type === "text",
    )
    .map((part) => part.text)
    .join("");
}

function ChatThread(props: {
  conversationId: string;
  initialMessages: UIMessage[];
}) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    id: props.conversationId,
    messages: props.initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/conversations/chat",
      body: { conversationId: props.conversationId },
    }),
  });

  const isBusy = status === "submitted" || status === "streaming";

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "max-w-2xl rounded-lg px-4 py-2 text-sm",
              message.role === "user"
                ? "bg-primary text-primary-foreground ml-auto"
                : "bg-muted",
            )}
          >
            {partsToText(message)}
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-muted-foreground text-sm">
            Say hello to start the conversation. Try “what time is it?” to see a
            tool call.
          </p>
        )}
      </div>

      <form
        className="flex gap-2 border-t p-4"
        onSubmit={(event) => {
          event.preventDefault();
          const text = input.trim();
          if (!text || isBusy) return;
          setInput("");
          void sendMessage({ text });
        }}
      >
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type a message…"
          aria-label="Message"
        />
        <Button type="submit" disabled={isBusy || input.trim().length === 0}>
          Send
        </Button>
      </form>
    </div>
  );
}

export function ChatPanel(props: { conversationId: string }) {
  const trpc = useTRPC();
  const { data: conversation, isPending } = useQuery(
    trpc.conversations.byId.queryOptions({ id: props.conversationId }),
  );

  if (isPending) {
    return (
      <div className="text-muted-foreground flex-1 p-4 text-sm">Loading…</div>
    );
  }

  const initialMessages: UIMessage[] = (conversation?.messages ?? []).map(
    (message) => ({
      id: message.id,
      role: message.role as UIMessage["role"],
      parts: [{ type: "text", text: message.content }],
    }),
  );

  return (
    <ChatThread
      key={props.conversationId}
      conversationId={props.conversationId}
      initialMessages={initialMessages}
    />
  );
}
