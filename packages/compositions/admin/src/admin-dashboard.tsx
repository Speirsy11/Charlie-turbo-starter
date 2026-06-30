"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  ConversationList,
  ConversationsTRPCReactProvider,
  useTRPC,
} from "@charlie/conversations";

function ConversationsStat() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.conversations.list.queryOptions());
  const count = Array.isArray(data) ? data.length : 0;

  return (
    <div className="rounded-lg border p-4">
      <p className="text-muted-foreground text-sm">Conversations</p>
      <p className="text-3xl font-bold">{count}</p>
    </div>
  );
}

/**
 * Admin shell — a composition that stitches feature components together into an
 * overview surface. It imports the conversations feature (and foundations),
 * never another composition. The app mounts it at `/admin`.
 */
export function AdminDashboard() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <ConversationsTRPCReactProvider>
      <main className="flex h-screen flex-col">
        <header className="flex items-center justify-between border-b p-4">
          <h1 className="text-xl font-bold">Admin</h1>
          <ConversationsStat />
        </header>
        <div className="flex flex-1 overflow-hidden">
          <ConversationList selectedId={selectedId} onSelect={setSelectedId} />
          <div className="text-muted-foreground flex flex-1 items-center justify-center text-sm">
            Select a conversation to inspect it.
          </div>
        </div>
      </main>
    </ConversationsTRPCReactProvider>
  );
}
