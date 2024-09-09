import {
    HydrateFlavor,
  } from "https://deno.land/x/grammy_hydrate@v1.4.1/mod.ts";
import { Context, SessionFlavor } from "https://deno.land/x/grammy@v1.30.0/mod.ts";
import {
    type Conversation,
    type ConversationFlavor,
} from "https://deno.land/x/grammy_conversations@v1.2.0/mod.ts"
import { FileFlavor } from 'https://deno.land/x/grammy_files@v1.1.1/mod.ts';

export interface SessionData {
    spamCounter: number;
}
export type SessionContext = Context & SessionFlavor<SessionData>;
export type HydrateContext = HydrateFlavor<SessionContext>;
export type FileContext = FileFlavor<HydrateContext>;
export type BotContext = FileContext & ConversationFlavor;
export type ConverstaionContext = Conversation<BotContext>;
