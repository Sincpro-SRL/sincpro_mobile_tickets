import "./global.css";

import { AppShell } from "@sincpro/mobile";
import { ticketsShell } from "@sincpro/mobile-tickets/entrypoints/main";
import { TicketsApp } from "@sincpro/mobile-tickets/entrypoints/ui/App";

export default function App() {
  return (
    <AppShell shell={ticketsShell}>
      <TicketsApp />
    </AppShell>
  );
}
