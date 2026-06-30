/**
 * Client-safe chat types and pure helpers. Lives at the package root export
 * (`@charlie/chat`) so both the browser UI and the server stream can share them
 * without pulling in the Vercel AI SDK server code.
 */

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessageView {
  id: string;
  role: ChatRole;
  text: string;
}

export type ArithmeticOperator = "+" | "-" | "*" | "/";

/**
 * Pure arithmetic used by the `calculate` demo tool. Kept here (client-safe and
 * dependency-free) so it can be unit-tested without touching the AI SDK.
 */
export function applyOperator(
  a: number,
  op: ArithmeticOperator,
  b: number,
): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? NaN : a / b;
  }
}
