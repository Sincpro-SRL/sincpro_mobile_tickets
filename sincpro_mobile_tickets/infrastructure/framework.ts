import { BoundedContext, servicesWith } from "@sincpro/client-framework";
import {
  registerDependencies,
  type TicketsDependencies,
} from "@sincpro/mobile-tickets/infrastructure/dependencies";

/**
 * The tickets bounded context and the bases of its use cases — the backend's `framework.py`:
 * a `Feature` extending these finds every dependency on `this`, and registers itself with
 * `@ticketsBoundedContext.feature(...)`.
 *
 * Context: the instance lives here, not in `services/index.ts`, because a service imports it to
 * register itself and ES modules run their imports first.
 */
export const { Feature, ApplicationService } = servicesWith<TicketsDependencies>();

export const ticketsBoundedContext = registerDependencies(
  new BoundedContext<TicketsDependencies>("tickets"),
);
