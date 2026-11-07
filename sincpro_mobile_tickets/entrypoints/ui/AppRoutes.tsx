import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DatabaseList, DeadLetterQueueList, EventsScreen } from "@sincpro/mobile/ui/screens";
import { LoginScreen } from "@sincpro/mobile-odoo/ui/screens/login";
import { OdooPortalScreen } from "@sincpro/mobile-odoo/ui/screens/odoo_portal";
import { ProfileScreen } from "@sincpro/mobile-odoo/ui/screens/profile";
import { ResetAccountScreen } from "@sincpro/mobile-odoo/ui/screens/reset_account";
import { ServerScreen } from "@sincpro/mobile-odoo/ui/screens/server";
import { SettingsScreen } from "@sincpro/mobile-odoo/ui/screens/settings";
import { HomeScreen } from "@sincpro/mobile-tickets/ui/screens/home/home.screen";
import { useTheme } from "@sincpro/mobile-ui/theme";

import { AppScreen } from "./AppScreen";
import { useTicketsGlobal } from "./context";

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const logo = require("../../../assets/TICKETS/logo.png");

function LoginRoute() {
  return <LoginScreen logoSource={logo} />;
}

function ProfileRoute() {
  return <ProfileScreen mainRoute={AppScreen.MAIN} />;
}

function MainTabs() {
  const theme = useTheme();

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.text.secondary,
        tabBarStyle: { backgroundColor: theme.bg.page },
      }}
    >
      <Tabs.Screen
        component={HomeScreen}
        name={AppScreen.MAIN}
        options={{ title: "Inicio" }}
      />
      <Tabs.Screen
        component={OdooPortalScreen}
        name={AppScreen.ODOO_PORTAL}
        options={{ title: "Odoo" }}
      />
      <Tabs.Screen
        component={SettingsScreen}
        name={AppScreen.SETTINGS}
        options={{ title: "Ajustes" }}
      />
      <Tabs.Screen
        component={ProfileRoute}
        name={AppScreen.PROFILE}
        options={{ title: "Perfil" }}
      />
    </Tabs.Navigator>
  );
}

function TicketsRoutes() {
  const { session, authIsLoading, serverParams } = useTicketsGlobal();

  if (authIsLoading) return null;

  const signedIn = Boolean(serverParams && session);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {signedIn ? (
        <>
          <Stack.Screen component={MainTabs} name="Main" />
          <Stack.Screen component={DeadLetterQueueList} name={AppScreen.DEAD_LETTER_QUEUE} />
          <Stack.Screen component={EventsScreen} name={AppScreen.EVENTS} />
          <Stack.Screen component={DatabaseList} name={AppScreen.DATABASE_LIST} />
        </>
      ) : (
        <>
          <Stack.Screen component={LoginRoute} name={AppScreen.LOGIN} />
          <Stack.Screen component={ServerScreen} name={AppScreen.SERVER} />
          <Stack.Screen component={ResetAccountScreen} name={AppScreen.RESET_ACCOUNT} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default TicketsRoutes;
