// The tickets event handlers register on ticketsBoundedContext when this loads.
import "@sincpro/mobile-tickets/entrypoints/queue";

import type { HearingContext } from "@sincpro/client-framework";
import { defineAppShell } from "@sincpro/mobile";
import { DomainModule } from "@sincpro/mobile/framework/domain_module";
import { configureLogger } from "@sincpro/mobile/infrastructure/logger";
import type { CronWorker } from "@sincpro/mobile/infrastructure/workers";
import { printerService } from "@sincpro/mobile/services/printer.service";
import { ProcessToastProvider } from "@sincpro/mobile/ui/components/molecules";
import { odooModule } from "@sincpro/mobile-odoo";
import { PrinterAdapter } from "@sincpro/mobile-tickets/adapters/Printer.adapter";
import TicketsCronJobs from "@sincpro/mobile-tickets/entrypoints/cron";
import { ticketsTelemetry } from "@sincpro/mobile-tickets/entrypoints/telemetry";
import { openNoticeIntent } from "@sincpro/mobile-tickets/entrypoints/ui/navigation";
import {
  TICKETS_DARK_THEME,
  TICKETS_THEME,
} from "@sincpro/mobile-tickets/entrypoints/ui/theme/tokens";
import { ticketsBoundedContext } from "@sincpro/mobile-tickets/services";
import { ConfirmationProvider } from "@sincpro/mobile-ui/Dialog";

export class TicketsModule extends DomainModule {
  readonly key = "TICKETS";
  readonly name = "Tickets";

  /** Its use cases and event handlers: `OnOdooSession` hears Odoo's login and logout. */
  override boundedContexts(): readonly HearingContext[] {
    return [ticketsBoundedContext];
  }

  override crons(): CronWorker[] {
    return TicketsCronJobs;
  }
}

export const ticketsModule = new TicketsModule();

// Release builds print nothing to the console; traces go to OTLP when the environment names the
// collector and its key (ticketsTelemetry).
configureLogger({ mode: __DEV__ ? "development" : "production" });

printerService.setDriver(PrinterAdapter);

/**
 * Prepared while the bundle loads, never inside a component: theme, fonts, the native splash
 * and the background crons, which the OS must find even when it wakes a closed app.
 */
export const ticketsShell = defineAppShell({
  theme: TICKETS_THEME,
  darkTheme: TICKETS_DARK_THEME,
  domains: [odooModule, ticketsModule],
  initialDomain: ticketsModule.key,
  providers: [ConfirmationProvider, ProcessToastProvider],
  // The buttons of a print notice ("Ver fallidas", "Impresora") open the host's screens.
  onNoticeAction: openNoticeIntent,
  telemetry: ticketsTelemetry(),
});
