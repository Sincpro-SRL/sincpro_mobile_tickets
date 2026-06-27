import { OdooProvider } from "@sincpro/mobile-odoo/entrypoints/ui/context";
import { useEffect } from "react";

import TicketsRoutes from "./AppRoutes";
import { TicketsGlobalProvider, useTicketsGlobal } from "./context";

function TicketsAppComponent() {
  const { loadServerParams, loadSession } = useTicketsGlobal();

  useEffect(() => {
    const init = async () => {
      await loadServerParams();
      await loadSession();
    };
    init();
  }, [loadServerParams, loadSession]);

  return <TicketsRoutes />;
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
