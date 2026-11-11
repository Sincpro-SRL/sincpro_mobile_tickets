/**
 * The tickets use cases, ready to execute: importing this registers each one on
 * `ticketsBoundedContext` (its decorator runs when its module loads). What the module and the
 * screens import — never `infrastructure/framework.ts` alone, which has none registered yet.
 */
export { ticketsBoundedContext } from "@sincpro/mobile-tickets/infrastructure/framework";
export {
  CommandEndSession,
  EndSession,
} from "@sincpro/mobile-tickets/services/session/end_session.feature";
export {
  CommandPrepareSession,
  PrepareSession,
} from "@sincpro/mobile-tickets/services/session/prepare_session.feature";
