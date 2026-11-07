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
import { Display } from "@sincpro/mobile-ui/Display";
import { useTheme } from "@sincpro/mobile-ui/theme";

import { AppScreen } from "./AppScreen";
import { useTicketsGlobal } from "./context";

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const logo = require("../../../assets/TICKETS/logo.png");

// Encabezado de las pantallas de acceso con el degradado de marca del tema (no el preset dorado
// por defecto de mobile-ui).
const AUTH_BACKGROUND = { surface: "brand" } as const;

function LoginRoute() {
  return <LoginScreen background={AUTH_BACKGROUND} logoSource={logo} />;
}

function ServerRoute() {
  return <ServerScreen background={AUTH_BACKGROUND} logoSource={logo} />;
}

function ResetAccountRoute() {
  return <ResetAccountScreen background={AUTH_BACKGROUND} logoSource={logo} />;
}

function ProfileRoute() {
  return <ProfileScreen mainRoute={AppScreen.MAIN} />;
}

const TAB_ICONS: Record<string, string> = {
  [AppScreen.MAIN]: "home-outline",
  [AppScreen.ODOO_PORTAL]: "globe-outline",
  [AppScreen.SETTINGS]: "settings-outline",
  [AppScreen.PROFILE]: "person-outline",
};

function MainTabs() {
  const theme = useTheme();

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.text.accent,
        tabBarInactiveTintColor: theme.text.secondary,
        tabBarStyle: { backgroundColor: theme.bg.page },
        tabBarIcon: ({ color, size }) => (
          <Display.Icon
            color={color}
            name={TAB_ICONS[route.name]}
            size={size}
            type="ionicons"
          />
        ),
      })}
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
  // El splash de App.tsx cubre la carga inicial de la sesión. No se desmonta el navegador mientras
  // `authIsLoading`: ese flag también se activa al iniciar sesión y dejaba la pantalla en blanco.
  const { session, serverParams } = useTicketsGlobal();

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
          <Stack.Screen component={ServerRoute} name={AppScreen.SERVER} />
          <Stack.Screen component={ResetAccountRoute} name={AppScreen.RESET_ACCOUNT} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default TicketsRoutes;
