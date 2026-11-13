import { Command } from "@sincpro/client-framework";
import { criteria } from "@sincpro/criteria";
import { CommandSearchEvents } from "@sincpro/mobile";
import type { EventRecord } from "@sincpro/mobile/domain/events";
import {
  Feature,
  ticketsBoundedContext,
} from "@sincpro/mobile-tickets/infrastructure/framework";
import {
  type FailedPrint,
  type FailedPrints,
  PRINTS,
  printTitle,
} from "@sincpro/mobile-tickets/services/prints/common";

export class CommandListFailedPrints extends Command<FailedPrints> {
  /** How many of the newest it brings; the total counts all of them. */
  readonly latest: number;

  constructor(latest = 3) {
    super();
    this.latest = latest;
  }
}

/**
 * The prints the queue set aside — the printer tab's summary, read in SQL:
 * 1. The core pages what it set aside, only prints, newest first (`CommandSearchEvents`, a
 *    child of this run): one page, with the exact count.
 * Final: the newest, each with its title, when it settled and why it did not come out, and how
 * many there are.
 */
@ticketsBoundedContext.feature(CommandListFailedPrints)
export class ListFailedPrints extends Feature<CommandListFailedPrints, FailedPrints> {
  async execute(command: CommandListFailedPrints): Promise<FailedPrints> {
    const page = await this.commonBoundedContext.execute(
      new CommandSearchEvents(
        criteria<EventRecord>(PRINTS)
          .selection(["state", "=", "set_aside"])
          .limit(command.latest)
          .counting("exact"),
      ),
    );
    const total = page.count?.value ?? page.rows.length;
    this.span.set({ "prints.failed": total });
    return { latest: page.rows.map((event) => this.toFailedPrint(event)), total };
  }

  private toFailedPrint(event: EventRecord): FailedPrint {
    return {
      id: event.id,
      title: printTitle(event),
      when: event.settledAt ?? event.publishedAt,
      reason: event.error ?? "No se pudo imprimir",
    };
  }
}
