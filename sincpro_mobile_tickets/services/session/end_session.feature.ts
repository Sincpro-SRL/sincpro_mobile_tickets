import { Command } from "@sincpro/client-framework";
import {
  Feature,
  ticketsBoundedContext,
} from "@sincpro/mobile-tickets/infrastructure/framework";

export class CommandEndSession extends Command<void> {
  constructor(readonly uid: number) {
    super();
  }
}

/**
 * Ends the tickets session: what runs after it carries no user or company. Doing it twice
 * changes nothing.
 */
@ticketsBoundedContext.feature(CommandEndSession)
export class EndSession extends Feature<CommandEndSession, void> {
  execute(command: CommandEndSession): void {
    this.processContext.clear("user_id", "company_id");
    this.logger.info("Tickets session ended", { user_id: command.uid });
  }
}
