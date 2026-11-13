import {
  type BottomTabBarButtonProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useCommon } from "@sincpro/mobile";
import { DatabaseList, DeadLetterQueueList, EventsScreen } from "@sincpro/mobile/ui/screens";
import { LoginScreen } from "@sincpro/mobile-odoo/ui/screens/login";
import {
  OdooPortalScreen,
  reloadOdooPortal,
} from "@sincpro/mobile-odoo/ui/screens/odoo_portal";
import { ProfileScreen } from "@sincpro/mobile-odoo/ui/screens/profile";
import { ResetAccountScreen } from "@sincpro/mobile-odoo/ui/screens/reset_account";
import { ServerScreen } from "@sincpro/mobile-odoo/ui/screens/server";
import { SettingsScreen } from "@sincpro/mobile-odoo/ui/screens/settings";
import { HomeScreen } from "@sincpro/mobile-tickets/ui/screens/home/home.screen";
import { FailedPrintsScreen } from "@sincpro/mobile-tickets/ui/screens/printer/failed_prints.screen";
import { PrinterScreen } from "@sincpro/mobile-tickets/ui/screens/printer/printer.screen";
import { useFailedPrints } from "@sincpro/mobile-tickets/ui/screens/printer/use_failed_prints";
import { Display, type IconName } from "@sincpro/mobile-ui/Display";
import Container from "@sincpro/mobile-ui/layouts/Container";
import { Pressable } from "@sincpro/mobile-ui/primitives/Pressable";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { Typography } from "@sincpro/mobile-ui/Typography";
import { View } from "react-native";

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
  return <ProfileScreen mainRoute={AppScreen.ODOO_PORTAL} />;
}

// The Odoo tab has no header, so the portal owns the top edge. WebKit keeps the page inside
// the safe area on its own; the Android WebView drew it under the status bar (edge-to-edge).
function OdooPortalRoute() {
  return (
    <Container edges={["top"]}>
      <OdooPortalScreen />
    </Container>
  );
}

// The framework screens no longer navigate on their own: the host decides how to go back.
function DeadLetterQueueRoute() {
  const navigation = useNavigation();
  return <DeadLetterQueueList onBack={() => navigation.goBack()} />;
}

function EventsRoute() {
  const navigation = useNavigation();
  return <EventsScreen onBack={() => navigation.goBack()} />;
}

function FailedPrintsRoute() {
  const navigation = useNavigation();
  return <FailedPrintsScreen onBack={() => navigation.goBack()} />;
}

function DatabaseListRoute() {
  const navigation = useNavigation();
  return <DatabaseList onBack={() => navigation.goBack()} />;
}

const TAB_ICONS: Record<string, IconName> = {
  [AppScreen.PRINTER]: "printer",
  [AppScreen.MAIN]: "sync",
  [AppScreen.SETTINGS_TAB]: "settings",
  [AppScreen.PROFILE]: "profile-circle",
};

// Odoo is the work, so it opens first and sits in the middle as a raised gold button. While
// Odoo is open, a tap reloads it from the cache and a long press downloads it again.
function OdooTabButton({
  onPress,
  onLongPress,
  accessibilityState,
  testID,
}: BottomTabBarButtonProps) {
  const theme = useTheme();
  const selected = accessibilityState?.selected ?? false;
  return (
    <Pressable
      accessibilityHint={
        selected ? "Toca para recargar; mantén presionado para limpiar la caché" : undefined
      }
      accessibilityLabel="Odoo"
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      onLongPress={(event) => {
        if (selected) {
          reloadOdooPortal({ clearCache: true });
          return;
        }
        onLongPress?.(event as never);
      }}
      onPress={(event) => {
        if (selected) {
          reloadOdooPortal();
          return;
        }
        onPress?.(event as never);
      }}
      style={{ flex: 1, alignItems: "center" }}
      testID={testID}
    >
      <View
        style={{
          width: 58,
          height: 58,
          marginTop: -22,
          borderRadius: 29,
          borderWidth: 4,
          borderColor: theme.bg.page,
          backgroundColor: theme.accent,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000000",
          shadowOpacity: 0.18,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
          elevation: 6,
        }}
      >
        <Display.Icon color={theme.text.onAccent} name="grid" size={26} />
      </View>
      <Typography.Text
        semibold={selected}
        style={{ color: selected ? theme.text.accent : theme.text.secondary, fontSize: 12 }}
      >
        Odoo
      </Typography.Text>
    </Pressable>
  );
}

/**
 * Impresora · Odoo · Perfil for everyone, Odoo always in the middle. Debug mode, which is
 * hidden, adds Actividad (event history, where prints can be resent) and Ajustes. Impresora
 * carries a red count of the prints that did not come out.
 */
function MainTabs() {
  const theme = useTheme();
  const { debugMode } = useCommon();
  const failedPrints = useFailedPrints().total;

  return (
    <Tabs.Navigator
      initialRouteName={AppScreen.ODOO_PORTAL}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.text.accent,
        tabBarInactiveTintColor: theme.text.secondary,
        tabBarStyle: { backgroundColor: theme.bg.page, overflow: "visible" },
        tabBarIcon: ({ color, size }) => (
          <Display.Icon color={color} name={TAB_ICONS[route.name] ?? "info"} size={size} />
        ),
      })}
    >
      <Tabs.Screen
        component={PrinterScreen}
        name={AppScreen.PRINTER}
        options={{
          title: "Impresora",
          tabBarBadge: failedPrints > 0 ? failedPrints : undefined,
          tabBarBadgeStyle: { backgroundColor: theme.danger, color: theme.text.onDanger },
        }}
      />
      {debugMode ? (
        <Tabs.Screen
          component={HomeScreen}
          name={AppScreen.MAIN}
          options={{ title: "Actividad" }}
        />
      ) : null}
      <Tabs.Screen
        component={OdooPortalRoute}
        name={AppScreen.ODOO_PORTAL}
        options={{ title: "Odoo", tabBarButton: (props) => <OdooTabButton {...props} /> }}
      />
      {debugMode ? (
        <Tabs.Screen
          component={SettingsScreen}
          name={AppScreen.SETTINGS_TAB}
          options={{ title: "Ajustes" }}
        />
      ) : null}
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
  const { debugMode } = useCommon();

  const signedIn = Boolean(serverParams && session);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {signedIn ? (
        <>
          <Stack.Screen component={MainTabs} name="Main" />
          <Stack.Screen component={SettingsScreen} name={AppScreen.SETTINGS} />
          <Stack.Screen component={FailedPrintsRoute} name={AppScreen.FAILED_PRINTS} />
          {debugMode ? (
            <>
              <Stack.Screen
                component={DeadLetterQueueRoute}
                name={AppScreen.DEAD_LETTER_QUEUE}
              />
              <Stack.Screen component={EventsRoute} name={AppScreen.EVENTS} />
              <Stack.Screen component={DatabaseListRoute} name={AppScreen.DATABASE_LIST} />
            </>
          ) : null}
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
