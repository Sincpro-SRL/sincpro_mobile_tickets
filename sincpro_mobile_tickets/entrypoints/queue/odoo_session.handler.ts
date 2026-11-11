import {
  OdooLoggedInEvent,
  OdooLoggedOutEvent,
} from "@sincpro/mobile-odoo/domain/auth/events";
import {
  EventHandler,
  ticketsBoundedContext,
} from "@sincpro/mobile-tickets/infrastructure/framework";
import { CommandEndSession } from "@sincpro/mobile-tickets/services/session/end_session.feature";
import { CommandPrepareSession } from "@sincpro/mobile-tickets/services/session/prepare_session.feature";

/** Someone signed in to or out of Odoo: the tickets session starts or ends with them. */
@ticketsBoundedContext.handler([OdooLoggedInEvent, OdooLoggedOutEvent])
export class OnOdooSession extends EventHandler<OdooLoggedInEvent | OdooLoggedOutEvent> {
  async handle(event: OdooLoggedInEvent | OdooLoggedOutEvent): Promise<void> {
    await this.boundedContext.execute(
      event instanceof OdooLoggedInEvent
        ? new CommandPrepareSession(event.uid, event.companyId)
        : new CommandEndSession(event.uid),
    );
  }
}
