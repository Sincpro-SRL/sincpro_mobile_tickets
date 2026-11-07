import { OdooProvider } from "@sincpro/mobile-odoo/entrypoints/ui/context";
import { Feedback } from "@sincpro/mobile-ui/Feedback";
import { useEffect, useState } from "react";

import TicketsRoutes from "./AppRoutes";
import { TicketsGlobalProvider, useTicketsGlobal } from "./context";

function TicketsAppComponent() {
  const { loadServerParams, loadSession } = useTicketsGlobal();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      await loadServerParams();
      await loadSession();
      if (!cancelled) setReady(true);
    };
    void init();
    return () => {
      cancelled = true;
    };
  }, [loadServerParams, loadSession]);

  return (
    <Feedback.SplashScreen
      isReady={ready}
      logo={require("../../../assets/TICKETS/logo.png")}
      title="Tickets"
      variant="hero"
    >
      <TicketsRoutes />
    </Feedback.SplashScreen>
  );
}

export function TicketsApp() {
  return (
    <OdooProvider>
      <TicketsGlobalProvider>
        <TicketsAppComponent />
      </TicketsGlobalProvider>
    </OdooProvider>
  );
}
