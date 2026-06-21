import { createAppShell, createTheme } from "@sincpro/mobile";
import type { Subscriber } from "@sincpro/mobile/domain/event_sourcing";
import { DomainModule } from "@sincpro/mobile/framework/domain_module";
import type { CronWorker } from "@sincpro/mobile/infrastructure/workers";
import { printerService } from "@sincpro/mobile/services/printer.service";
import { ProcessToastProvider } from "@sincpro/mobile/ui/components/molecules";
import { odooModule } from "@sincpro/mobile-odoo";
import { PrinterAdapter } from "@sincpro/mobile-tickets/adapters/Printer.adapter";
import TicketsCronJobs from "@sincpro/mobile-tickets/entrypoints/cron";
import { TicketsSubscribers } from "@sincpro/mobile-tickets/entrypoints/queue";
import { TicketsApp } from "@sincpro/mobile-tickets/entrypoints/ui/App";
import { TICKETS_THEME } from "@sincpro/mobile-tickets/entrypoints/ui/theme/tokens";
import { ConfirmationProvider } from "@sincpro/mobile-ui/Dialog";
import type { ComponentType } from "react";

export class TicketsModule extends DomainModule {
  readonly key = "TICKETS";
  readonly name = "Tickets";

  override subscribers(): Subscriber[] {
    return TicketsSubscribers;
  }

  override crons(): CronWorker[] {
    return TicketsCronJobs;
  }
}

export const ticketsModule = new TicketsModule();

export function createTicketsApp(): ComponentType {
  printerService.setDriver(PrinterAdapter);

  return createAppShell({
    theme: createTheme(TICKETS_THEME),
    domains: [odooModule, ticketsModule],
    ui: { [ticketsModule.key]: TicketsApp },
    activeDomain: ticketsModule.key,
    providers: [ConfirmationProvider, ProcessToastProvider],
  });
}
