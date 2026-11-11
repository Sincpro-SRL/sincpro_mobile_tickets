import { OdooLoggedOutEvent } from "@sincpro/mobile-odoo/domain/auth/events";
import {
  Feature,
  ticketsBoundedContext,
} from "@sincpro/mobile-tickets/infrastructure/framework";

/**
 * Ends the tickets session when Odoo says the person signed out: what runs after it carries no
 * user or company. Doing it twice changes nothing.
 */
@ticketsBoundedContext.feature(OdooLoggedOutEvent)
export class EndSession extends Feature<OdooLoggedOutEvent, void> {
  execute(event: OdooLoggedOutEvent): void {
    this.processContext.clear("user_id", "company_id");
    this.logger.info("Tickets session ended", { user_id: event.uid });
  }
}
