import { OdooProvider } from "@sincpro/mobile-odoo/entrypoints/ui/context";
import { Feedback } from "@sincpro/mobile-ui/Feedback";
import { useEffect, useState } from "react";

import TicketsRoutes from "./AppRoutes";
import { TicketsGlobalProvider, useTicketsGlobal } from "./context";

function TicketsAppComponent() {
  const { loadServerParams, loadSession } = useTicketsGlobal();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const init = async () => {
      await loadServerParams();
      await loadSession();
    };
    init();
  }, [loadServerParams, loadSession]);

  return (
    <Feedback.DomainSplashScreen
      domainName="Tickets"
      isLoading={showSplash}
      onComplete={() => setShowSplash(false)}
    >
      <TicketsRoutes />
    </Feedback.DomainSplashScreen>
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
