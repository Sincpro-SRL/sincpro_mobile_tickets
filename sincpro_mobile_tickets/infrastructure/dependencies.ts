import { type BoundedContext, processContext } from "@sincpro/client-framework";

/**
 * What every use case of `ticketsBoundedContext` finds on `this` — the backend's
 * `dependencies.py`: declared once here, never in a Feature.
 */
export interface TicketsDependencies {
  /** The process's context: what every run, span and log line after it carries. */
  processContext: typeof processContext;
}

/** Supplies each dependency; a test replaces one with `addDependency(…, { replaces })`. */
export function registerDependencies(
  boundedContext: BoundedContext<TicketsDependencies>,
): BoundedContext<TicketsDependencies> {
  boundedContext.addDependency("processContext", processContext);
  return boundedContext;
}
