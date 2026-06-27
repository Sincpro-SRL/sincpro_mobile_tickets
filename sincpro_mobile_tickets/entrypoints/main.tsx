import { FiraCode_400Regular, FiraCode_500Medium } from "@expo-google-fonts/fira-code";
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
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
import {
  TICKETS_DARK_THEME,
  TICKETS_THEME,
} from "@sincpro/mobile-tickets/entrypoints/ui/theme/tokens";
import { ConfirmationProvider } from "@sincpro/mobile-ui/Dialog";
import { AppSplashView } from "@sincpro/mobile-ui/views/AppSplashView";
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

const LOGO = require("../../assets/TICKETS/logo.png");

const SPLASH_BACKGROUND = {
  colors: ["#14242E", "#00313C", "#1A4A58"] as const,
  pattern: "grid" as const,
  patternOpacity: 0.12,
};

function TicketsSplash() {
  return <AppSplashView background={SPLASH_BACKGROUND} logo={LOGO} />;
}

export function createTicketsApp(): ComponentType {
  printerService.setDriver(PrinterAdapter);

  return createAppShell({
    theme: createTheme(TICKETS_THEME),
    darkTheme: createTheme(TICKETS_DARK_THEME),

    brandFont: {
      // ── Archivos de fuente ─────────────────────────────────────────────────
      files: {
        // df — Display (Satoshi · assets locales del módulo)
        "Satoshi-Regular": require("../../assets/fonts/Satoshi-Regular.otf"),
        "Satoshi-Medium": require("../../assets/fonts/Satoshi-Medium.otf"),
        "Satoshi-Bold": require("../../assets/fonts/Satoshi-Bold.otf"),
        "Satoshi-Black": require("../../assets/fonts/Satoshi-Black.otf"),
        // bf — Body (Inter · @expo-google-fonts/inter)
        Inter_300Light,
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_800ExtraBold,
        // cf + mono (Fira Code · @expo-google-fonts/fira-code)
        FiraCode_400Regular,
        FiraCode_500Medium,
      },

      // ── Mapeo al manual de marca ───────────────────────────────────────────
      families: {
        // df — Títulos y encabezados
        display: {
          regular: "Satoshi-Regular",
          medium: "Satoshi-Medium",
          bold: "Satoshi-Bold",
          black: "Satoshi-Black",
        },
        // bf — Cuerpo, labels, botones
        body: {
          light: "Inter_300Light",
          regular: "Inter_400Regular",
          medium: "Inter_500Medium",
          semiBold: "Inter_600SemiBold",
          extraBold: "Inter_800ExtraBold",
        },
        // cf — Captions, overlines, metadata
        caption: {
          regular: "FiraCode_400Regular",
          medium: "FiraCode_500Medium",
        },
        // mono — Datos numéricos, SKU, montos
        mono: {
          regular: "FiraCode_400Regular",
          medium: "FiraCode_500Medium",
        },
      },
    },

    domains: [odooModule, ticketsModule],
    ui: { [ticketsModule.key]: TicketsApp },
    activeDomain: ticketsModule.key,
    providers: [ConfirmationProvider, ProcessToastProvider],
    splashComponent: TicketsSplash,
  });
}
