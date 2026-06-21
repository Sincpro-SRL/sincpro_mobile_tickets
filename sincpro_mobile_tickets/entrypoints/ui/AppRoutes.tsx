import {
  LoginScreen,
  OdooPortalScreen,
  ProfileScreen,
  ResetAccountScreen,
  ServerScreen,
  SettingsScreen,
} from "@sincpro/mobile-odoo/ui/screens";
import { AppScreen } from "@sincpro/mobile-tickets/entrypoints/ui/AppScreen";
import { HomeScreen } from "@sincpro/mobile-tickets/ui/screens";
import { PlainLayout, TabNavigatorLayout } from "@sincpro/mobile";
import { UIEventBus } from "@sincpro/mobile/infrastructure/ui/UIEventBus";
import {
  DatabaseList,
  DeadLetterQueueList,
  EventsScreen,
} from "@sincpro/mobile/ui/screens";
import HomeIcon from "@sincpro/mobile-ui/icons/HomeIcon";
import OdooIcon from "@sincpro/mobile-ui/icons/OdooIcon";
import ProfileIcon from "@sincpro/mobile-ui/icons/ProfileIcon";
import SettingsIcon from "@sincpro/mobile-ui/icons/SettingsIcon";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-native";

import { useTicketsGlobal } from "./context";

function TicketsRoutes() {
  const navigate = useNavigate();
  const { session, authIsLoading, serverParams } = useTicketsGlobal();

  useEffect(() => {
    if (authIsLoading) return;
    if (!serverParams || !session) {
      navigate(AppScreen.LOGIN, { replace: true });
    } else {
      navigate(AppScreen.MAIN, { replace: true });
    }
  }, [session, authIsLoading, serverParams]);

  return (
    <Routes>
      <Route
        element={
          <TabNavigatorLayout
            persistentComponent={<OdooPortalScreen />}
            persistentRoutePath={AppScreen.ODOO_PORTAL}
          >
            <TabNavigatorLayout.Tabs>
              <TabNavigatorLayout.Tab
                Icon={OdooIcon}
                label="Odoo"
                onReselect={() => UIEventBus.emit("tickets:odoo:reload")}
                path={AppScreen.ODOO_PORTAL}
              />
              <TabNavigatorLayout.Tab
                Icon={HomeIcon}
                label="Principal"
                path={AppScreen.MAIN}
              />
              <TabNavigatorLayout.Tab
                Icon={SettingsIcon}
                label="Settings"
                path={AppScreen.SETTINGS}
              />
              <TabNavigatorLayout.Tab
                Icon={ProfileIcon}
                label="Perfil"
                path={AppScreen.PROFILE}
              />
            </TabNavigatorLayout.Tabs>
          </TabNavigatorLayout>
        }
      >
        <Route element={<HomeScreen />} path={AppScreen.MAIN} />
        <Route element={<OdooPortalScreen />} path={AppScreen.ODOO_PORTAL} />
        <Route element={<SettingsScreen />} path={AppScreen.SETTINGS} />
        <Route
          element={<DeadLetterQueueList />}
          path={AppScreen.DEAD_LETTER_QUEUE}
        />
        <Route element={<EventsScreen />} path={AppScreen.EVENTS} />
        <Route element={<DatabaseList />} path={AppScreen.DATABASE_LIST} />
        <Route
          element={
            <ProfileScreen
              logoSource={require("../../../assets/TICKETS/logo.png")}
              mainRoute={AppScreen.MAIN}
            />
          }
          path={AppScreen.PROFILE}
        />
      </Route>
      <Route element={<PlainLayout />}>
        <Route
          element={
            <LoginScreen logoSource={require("../../../assets/TICKETS/logo.png")} />
          }
          path={AppScreen.LOGIN}
        />
        <Route element={<ServerScreen />} path={AppScreen.SERVER} />
        <Route
          element={<ResetAccountScreen />}
          path={AppScreen.RESET_ACCOUNT}
        />
      </Route>
    </Routes>
  );
}

export default TicketsRoutes;
