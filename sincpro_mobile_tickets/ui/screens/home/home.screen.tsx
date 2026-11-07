import { useNavigation } from "@react-navigation/native";
import { IconType } from "@sincpro/mobile/domain/icon";
import { AppScreen } from "@sincpro/mobile-tickets/entrypoints/ui/AppScreen";
import BoxTimeIcon from "@sincpro/mobile-ui/icons/BoxTimeIcon";
import OdooIcon from "@sincpro/mobile-ui/icons/OdooIcon";
import SettingsIcon from "@sincpro/mobile-ui/icons/SettingsIcon";
import { HomeHeader, MenuGrid, type MenuItem } from "@sincpro/mobile-ui/widgets";
import { ScrollView, View } from "react-native";

function HomeScreen() {
  const navigation = useNavigation();

  const menuItems: MenuItem[] = [
    {
      id: "1",
      title: "Odoo",
      iconType: "custom" as IconType,
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
      <HomeHeader
        logoSource={require("../../../../assets/TICKETS/logo.png")}
        title="Tickets"
      />
      <View className="flex-1">
        <ScrollView contentContainerClassName="flex-grow">
          <MenuGrid items={menuItems} />
        </ScrollView>
      </View>
    </View>
  );
}

export { HomeScreen };
