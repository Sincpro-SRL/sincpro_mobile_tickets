import { type BoundedContext, processContext } from "@sincpro/client-framework";
import { commonBoundedContext } from "@sincpro/mobile";

/**
 * What every use case of `ticketsBoundedContext` finds on `this` — the backend's
 * `dependencies.py`: declared once here, never in a Feature.
 */
export interface TicketsDependencies {
  /** The process's context: what every run, span and log line after it carries. */
  processContext: typeof processContext;
  /**
   * The core's bounded context: what a use case asks of the phone (its stored events, the
   * printer). Bound to each run, so what it executes is a child of the caller — one trace.
   */
  commonBoundedContext: typeof commonBoundedContext;
}

/** Supplies each dependency; a test replaces one with `addDependency(…, { replaces })`. */
export function registerDependencies(
  boundedContext: BoundedContext<TicketsDependencies>,
): BoundedContext<TicketsDependencies> {
  boundedContext.addDependency("processContext", processContext);
  boundedContext.addDependency("commonBoundedContext", commonBoundedContext);
  return boundedContext;
}
