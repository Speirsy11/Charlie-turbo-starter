import { tool } from "ai";
import { z } from "zod/v4";

import type { ArithmeticOperator } from "../chat-state";
import { applyOperator } from "../chat-state";

/**
 * A tiny demo toolset wired into the agent so the starter shows tool-calling
 * out of the box. Replace/extend these with your own tools.
 */
export const chatTools = {
  getCurrentTime: tool({
    description: "Get the current date and time as an ISO 8601 string.",
    inputSchema: z.object({}),
    execute: () => ({ now: new Date().toISOString() }),
  }),
  calculate: tool({
    description:
      "Evaluate a basic arithmetic expression of the form `a op b` where op is one of + - * /.",
    inputSchema: z.object({
      a: z.number(),
      op: z.enum(["+", "-", "*", "/"]),
      b: z.number(),
    }),
    execute: ({
      a,
      op,
      b,
    }: {
      a: number;
      op: ArithmeticOperator;
      b: number;
    }) => ({
      result: applyOperator(a, op, b),
    }),
  }),
};
