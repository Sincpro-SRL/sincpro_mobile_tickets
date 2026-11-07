import { useNavigation } from "@react-navigation/native";
import { AppScreen } from "@sincpro/mobile-tickets/entrypoints/ui/AppScreen";
import { Display } from "@sincpro/mobile-ui/Display";
import type { MenuGridItem } from "@sincpro/mobile-ui/Display/Display.MenuGrid";
import BoxTimeIcon from "@sincpro/mobile-ui/icons/BoxTimeIcon";
import OdooIcon from "@sincpro/mobile-ui/icons/OdooIcon";
import SettingsIcon from "@sincpro/mobile-ui/icons/SettingsIcon";
import { AppBar } from "@sincpro/mobile-ui/Navigation/Navigation.AppBar";
import { ScrollView, View } from "react-native";

function HomeScreen() {
  const navigation = useNavigation();

  const menuItems: MenuGridItem[] = [
    {
      id: "1",
      title: "Odoo",
      iconType: "custom",
      onPress: () => navigation.navigate(AppScreen.ODOO_PORTAL as never),
      customIcon: OdooIcon,
    },
    {
      id: "2",
      title: "Acciones fallidas",
      iconType: "custom",
      onPress: () => navigation.navigate(AppScreen.DEAD_LETTER_QUEUE as never),
      customIcon: BoxTimeIcon,
    },
    {
      id: "3",
      title: "Eventos",
      iconType: "custom",
      onPress: () => navigation.navigate(AppScreen.EVENTS as never),
      customIcon: BoxTimeIcon,
    },
    {
      id: "4",
      title: "Configurar impresora",
      iconType: "custom",
      onPress: () => navigation.navigate(AppScreen.SETTINGS as never),
      customIcon: SettingsIcon,
    },
  ];

  return (
    <View className="flex-1">
      <AppBar
        background={{ surface: "brand" }}
        leading={
          <Display.Logo
            size="small"
            source={require("../../../../assets/TICKETS/logo.png")}
          />
        }
        title="Tickets"
        variant="large"
      />
      <View className="flex-1">
        <ScrollView contentContainerClassName="flex-grow">
          <Display.MenuGrid items={menuItems} />
        </ScrollView>
      </View>
    </View>
  );
}

export { HomeScreen };
