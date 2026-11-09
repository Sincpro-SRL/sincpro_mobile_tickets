import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type Theme,
} from "@react-navigation/native";
import { OdooProvider } from "@sincpro/mobile-odoo/entrypoints/ui/context";
import { Feedback } from "@sincpro/mobile-ui/Feedback";
import { type ThemeTokens, useTheme } from "@sincpro/mobile-ui/theme";
import { resolveOnColor } from "@sincpro/mobile-ui/theme/contrast";
import { useEffect, useMemo, useState } from "react";

import TicketsRoutes from "./AppRoutes";
import { TicketsGlobalProvider, useTicketsGlobal } from "./context";
import { navigationRef } from "./navigation";

/** The navigator paints from the active DS theme, so light/dark switches reach it too. */
function navigationTheme(theme: ThemeTokens): Theme {
  const base = resolveOnColor(theme.bg.page) === "#FFFFFF" ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: theme.primary,
      background: theme.bg.page,
      card: theme.bg.page,
      text: theme.text.primary,
      border: theme.border.light,
      notification: theme.danger,
    },
  };
}

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

/** The host owns navigation: the AppShell renders this as its children. */
export function TicketsApp() {
  const theme = useTheme();
  const navTheme = useMemo(() => navigationTheme(theme), [theme]);

  return (
    <NavigationContainer ref={navigationRef} theme={navTheme}>
      <OdooProvider>
        <TicketsGlobalProvider>
          <TicketsAppComponent />
        </TicketsGlobalProvider>
      </OdooProvider>
    </NavigationContainer>
  );
}
