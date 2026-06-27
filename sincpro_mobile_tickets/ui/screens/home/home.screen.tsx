import { useNavigation } from "@react-navigation/native";
import { IconType } from "@sincpro/mobile/domain/icon";
import { OdooIcon } from "@sincpro/mobile-odoo/ui/components/atoms";
import { AppScreen } from "@sincpro/mobile-tickets/entrypoints/ui/AppScreen";
import BoxTimeIcon from "@sincpro/mobile-ui/icons/BoxTimeIcon";
import SettingsIcon from "@sincpro/mobile-ui/icons/SettingsIcon";
import { AppBar } from "@sincpro/mobile-ui/Navigation/Navigation.AppBar";
import { useTheme } from "@sincpro/mobile-ui/theme";
import { MenuGrid, type MenuItem as MenuGridItem } from "@sincpro/mobile-ui/widgets";
import { ScrollView, View } from "react-native";

function HomeScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const isDark = theme.name.includes("dark");

  const menuItems: MenuGridItem[] = [
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
      <AppBar
        background={
          isDark
            ? {
                colors: ["#14242E", "#00313C", "#1A4A58"],
                pattern: "grid",
                patternOpacity: 0.12,
              }
            : {
                colors: ["#00313C", "#1A4A58"],
                pattern: "dots",
                patternOpacity: 0.08,
              }
        }
        bottomDivider="wave"
        safeArea={false}
        title="Mi tren"
        topSpacing={16}
        variant="large"
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
