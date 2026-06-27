import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UIEventBus } from "@sincpro/mobile/infrastructure/ui/UIEventBus";
import { DatabaseList, DeadLetterQueueList, EventsScreen } from "@sincpro/mobile/ui/screens";
import { OdooIcon } from "@sincpro/mobile-odoo/ui/components/atoms";
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
import { BottomInsetContext } from "@sincpro/mobile-ui";
import HomeIcon from "@sincpro/mobile-ui/icons/HomeIcon";
import ProfileIcon from "@sincpro/mobile-ui/icons/ProfileIcon";
import SettingsIcon from "@sincpro/mobile-ui/icons/SettingsIcon";
import {
  BottomNav,
  type BottomNavItem,
} from "@sincpro/mobile-ui/Navigation/Navigation.BottomNav";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTicketsGlobal } from "./context";

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const LOGO = require("../../../assets/TICKETS/logo.png");

const TAB_ITEMS: BottomNavItem[] = [
  { key: AppScreen.ODOO_PORTAL, customIcon: OdooIcon, label: "Odoo" },
  { key: AppScreen.HOME, customIcon: HomeIcon, label: "Principal" },
  { key: AppScreen.SETTINGS, customIcon: SettingsIcon, label: "Ajustes" },
  { key: AppScreen.PROFILE, customIcon: ProfileIcon, label: "Perfil" },
];

function ProfileTab() {
  return <ProfileScreen mainRoute={AppScreen.HOME} />;
}

const AUTH_BACKGROUND = {
  colors: ["#14242E", "#00313C", "#1A4A58"] as const,
  pattern: "grid" as const,
  patternOpacity: 0.12,
};

function LoginWithLogo() {
  return <LoginScreen background={AUTH_BACKGROUND} logoSource={LOGO} />;
}

function ServerWithLogo() {
  return <ServerScreen background={AUTH_BACKGROUND} logoSource={LOGO} />;
}

function ResetAccountWithLogo() {
  return <ResetAccountScreen background={AUTH_BACKGROUND} logoSource={LOGO} />;
}

// Gap below pill (12) + pill height (~60) — SafeAreaView already handles insets.bottom.
const FLOATING_TAB_INSET = 72;

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <BottomInsetContext.Provider value={FLOATING_TAB_INSET}>
      <Tabs.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => {
          const activeKey = props.state.routes[props.state.index].name;
          return (
            <View
              pointerEvents="box-none"
              style={{
                position: "absolute",
                left: 16,
                right: 16,
                bottom: insets.bottom + 12,
              }}
            >
              <BottomNav
                activeColor="accent"
                indicator="pill-text"
                items={TAB_ITEMS}
                onChange={(key) => {
                  if (key === AppScreen.ODOO_PORTAL && activeKey === AppScreen.ODOO_PORTAL) {
                    UIEventBus.emit("tickets:odoo:reload");
                    return;
                  }
                  props.navigation.navigate(key as never);
                }}
                shape="floating"
                showLabels={false}
                value={activeKey}
              />
            </View>
          );
        }}
      >
        <Tabs.Screen component={OdooPortalScreen} name={AppScreen.ODOO_PORTAL} />
        <Tabs.Screen component={HomeScreen} name={AppScreen.HOME} />
        <Tabs.Screen component={SettingsScreen} name={AppScreen.SETTINGS} />
        <Tabs.Screen component={ProfileTab} name={AppScreen.PROFILE} />
      </Tabs.Navigator>
    </BottomInsetContext.Provider>
  );
}

function TicketsRoutes() {
  const { session, serverParams } = useTicketsGlobal();
  const isAuthenticated = !!session && !!serverParams;
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.bg.page } }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen component={MainTabs} name={AppScreen.MAIN} />
          <Stack.Screen component={DeadLetterQueueList} name={AppScreen.DEAD_LETTER_QUEUE} />
          <Stack.Screen component={EventsScreen} name={AppScreen.EVENTS} />
          <Stack.Screen component={DatabaseList} name={AppScreen.DATABASE_LIST} />
        </>
      ) : (
        <>
          <Stack.Screen component={LoginWithLogo} name={AppScreen.LOGIN} />
          <Stack.Screen component={ServerWithLogo} name={AppScreen.SERVER} />
          <Stack.Screen component={ResetAccountWithLogo} name={AppScreen.RESET_ACCOUNT} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default TicketsRoutes;
