import { Command } from "@sincpro/client-framework";
import { CommandListFailedEvents } from "@sincpro/mobile";
import type { EventRecord } from "@sincpro/mobile/domain/events";
import {
  Feature,
  ticketsBoundedContext,
} from "@sincpro/mobile-tickets/infrastructure/framework";
import {
  type FailedPrint,
  isFailedPrint,
  printTitle,
} from "@sincpro/mobile-tickets/services/prints/common";

export class CommandListFailedPrints extends Command<FailedPrint[]> {}

/**
 * The prints the queue set aside, newest first — the printer tab's summary:
 * 1. The core lists what it set aside (`CommandListFailedEvents`, a child of this run).
 * Final: only the prints, each with its title, when it settled and why it did not come out.
 */
@ticketsBoundedContext.feature(CommandListFailedPrints)
export class ListFailedPrints extends Feature<CommandListFailedPrints, FailedPrint[]> {
  async execute(): Promise<FailedPrint[]> {
    const failed = await this.commonBoundedContext.execute(new CommandListFailedEvents());
    const prints = failed
      .filter(isFailedPrint)
      .map((event) => this.toFailedPrint(event))
      .sort((a, b) => b.when.localeCompare(a.when));
    this.span.set({ "prints.failed": prints.length });
    return prints;
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
