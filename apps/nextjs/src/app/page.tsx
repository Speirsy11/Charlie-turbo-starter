import Link from "next/link";

import { Button } from "@charlie/ui/button";

import { AuthShowcase } from "./_components/auth-showcase";

export default function HomePage() {
  return (
    <main className="container flex h-screen flex-col items-center justify-center gap-8 py-16">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Charlie <span className="text-primary">Turbo</span> Starter
      </h1>
      <p className="text-muted-foreground max-w-xl text-center">
        A layered Turborepo starter: foundations → services → features →
        compositions → app, with decentralized tRPC and a streaming AI chat
        feature.
      </p>

      <AuthShowcase />

      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/conversations">Open conversations</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/admin">Admin</Link>
        </Button>
      </div>
    </main>
  );
}
