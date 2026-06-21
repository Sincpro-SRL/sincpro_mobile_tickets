import { IconType } from "@sincpro/mobile/domain/icon";
import BoxTimeIcon from "@sincpro/mobile-ui/icons/BoxTimeIcon";
import OdooIcon from "@sincpro/mobile-ui/icons/OdooIcon";
import SettingsIcon from "@sincpro/mobile-ui/icons/SettingsIcon";
import {
  HomeHeader,
  MenuGrid,
  type MenuItem,
} from "@sincpro/mobile-ui/widgets";
import { ScrollView, View } from "react-native";
import { useNavigate } from "react-router-native";

import { AppScreen } from "@sincpro/mobile-tickets/entrypoints/ui/AppScreen";

function HomeScreen() {
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      id: "1",
      title: "Odoo",
      iconType: "custom" as IconType,
      onPress: () => navigate(AppScreen.ODOO_PORTAL),
      customIcon: OdooIcon,
    },
    {
      id: "2",
      title: "Acciones fallidas",
      iconType: "custom",
      onPress: () => navigate(AppScreen.DEAD_LETTER_QUEUE),
      customIcon: BoxTimeIcon,
    },
    {
      id: "3",
      title: "Eventos",
      iconType: "custom",
      onPress: () => navigate(AppScreen.EVENTS),
      customIcon: BoxTimeIcon,
    },
    {
      id: "4",
      title: "Configurar impresora",
      iconType: "custom",
      onPress: () => navigate(AppScreen.SETTINGS),
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
