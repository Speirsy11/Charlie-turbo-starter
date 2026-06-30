"use client";

import { useState } from "react";

import { ChatPanel } from "./chat-thread";
import { ConversationList } from "./conversation-list";

/**
 * The full conversations page, owned by the feature. The app mounts this at
 * `/conversations` (wrapped in `ConversationsTRPCReactProvider`) — it imports
 * the component, not the internals.
 */
export function ConversationsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="flex h-screen">
      <ConversationList selectedId={selectedId} onSelect={setSelectedId} />
      {selectedId ? (
        <ChatPanel conversationId={selectedId} />
      ) : (
        <div className="text-muted-foreground flex flex-1 items-center justify-center text-sm">
          Select or create a conversation to start chatting.
        </div>
      )}
    </div>
  );
}
