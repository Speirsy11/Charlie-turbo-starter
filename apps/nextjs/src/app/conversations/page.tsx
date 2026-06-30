import {
  ConversationsPage,
  ConversationsTRPCReactProvider,
} from "@charlie/conversations";

export default function Page() {
  return (
    <ConversationsTRPCReactProvider>
      <ConversationsPage />
    </ConversationsTRPCReactProvider>
  );
}
