"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { cn } from "@charlie/ui";
import { Button } from "@charlie/ui/button";

import { useTRPC } from "../trpc/react";

export function ConversationList(props: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: conversations } = useQuery(
    trpc.conversations.list.queryOptions(),
  );

  const createConversation = useMutation(
    trpc.conversations.create.mutationOptions({
      onSuccess: async (created) => {
        await queryClient.invalidateQueries(
          trpc.conversations.list.pathFilter(),
        );
        if (created) props.onSelect(created.id);
      },
    }),
  );

  const deleteConversation = useMutation(
    trpc.conversations.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.conversations.list.pathFilter(),
        );
      },
    }),
  );

  return (
    <div className="flex w-64 shrink-0 flex-col gap-2 border-r p-4">
      <Button
        className="w-full"
        onClick={() => createConversation.mutate({})}
        disabled={createConversation.isPending}
      >
        New conversation
      </Button>

      <ul className="flex flex-col gap-1">
        {(conversations ?? []).map((conversation) => (
          <li key={conversation.id}>
            <button
              type="button"
              onClick={() => props.onSelect(conversation.id)}
              className={cn(
                "hover:bg-muted flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm",
                conversation.id === props.selectedId && "bg-muted font-medium",
              )}
            >
              <span className="truncate">{conversation.title}</span>
              <span
                role="button"
                tabIndex={0}
                aria-label="Delete conversation"
                className="text-muted-foreground hover:text-foreground ml-2 text-xs"
                onClick={(event) => {
                  event.stopPropagation();
                  deleteConversation.mutate({ id: conversation.id });
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.stopPropagation();
                    deleteConversation.mutate({ id: conversation.id });
                  }
                }}
              >
                ✕
              </span>
            </button>
          </li>
        ))}
      </ul>

      {conversations?.length === 0 && (
        <p className="text-muted-foreground px-3 py-2 text-sm">
          No conversations yet. Create one to start chatting.
        </p>
      )}
    </div>
  );
}
