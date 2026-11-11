import { Command } from "@sincpro/client-framework";
import { OdooLoggedInEvent } from "@sincpro/mobile-odoo/domain/auth/events";
import {
  Feature,
  ticketsBoundedContext,
} from "@sincpro/mobile-tickets/infrastructure/framework";

export class CommandPrepareSession extends Command<void> {
  constructor(
    readonly uid: number,
    readonly companyId: number,
  ) {
    super();
  }
}

/**
 * Prepares the tickets session for who signed in — executed by the queue when Odoo says so
 * (`OdooLoggedInEvent`) and by the app when it restores a session kept on the phone.
 * Final: every run, span and log line after it carries the user and the company (`user_id`,
 * `company_id`), never their name or login. Doing it twice changes nothing.
 */
@ticketsBoundedContext.feature([CommandPrepareSession, OdooLoggedInEvent])
export class PrepareSession extends Feature<CommandPrepareSession | OdooLoggedInEvent, void> {
  execute(input: CommandPrepareSession | OdooLoggedInEvent): void {
    this.processContext.set({ user_id: input.uid, company_id: input.companyId });
    this.logger.info("Tickets session prepared", {
      user_id: input.uid,
      company_id: input.companyId,
    });
  }
}
