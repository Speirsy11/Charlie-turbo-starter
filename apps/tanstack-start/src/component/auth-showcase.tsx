import { Show, SignInButton, UserButton } from "@clerk/tanstack-react-start";

import { Button } from "@charlie/ui/button";

export function AuthShowcase() {
  return (
    <div className="flex items-center justify-center gap-4">
      <Show when="signed-out">
        <SignInButton>
          <Button size="lg">Sign in</Button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
}
