import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ConversationList } from "../../components/conversation-list";

// The component is exercised in isolation: the feature's tRPC hooks and
// TanStack Query are mocked so the test stays a pure render check.
vi.mock("../../trpc/react", () => ({
  useTRPC: () => ({
    conversations: {
      list: { queryOptions: () => ({}), pathFilter: () => ({}) },
      create: { mutationOptions: () => ({}) },
      delete: { mutationOptions: () => ({}) },
    },
  }),
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: () => ({ data: [{ id: "c1", title: "My first chat" }] }),
  useMutation: () => ({ mutate: vi.fn(), isPending: false }),
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));

describe("ConversationList", () => {
  it("renders conversations and the new-conversation button", () => {
    render(<ConversationList selectedId={null} onSelect={() => undefined} />);

    expect(screen.getByText("My first chat")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "New conversation" }),
    ).toBeInTheDocument();
  });
});
