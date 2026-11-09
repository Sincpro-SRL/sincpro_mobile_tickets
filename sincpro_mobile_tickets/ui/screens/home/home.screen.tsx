import { useNavigation } from "@react-navigation/native";
import { AppScreen } from "@sincpro/mobile-tickets/entrypoints/ui/AppScreen";
import { Display } from "@sincpro/mobile-ui/Display";
import type { MenuGridItem } from "@sincpro/mobile-ui/Display/Display.MenuGrid";
import { AppBar } from "@sincpro/mobile-ui/Navigation/Navigation.AppBar";
import { ScrollView, View } from "react-native";

function HomeScreen() {
  const navigation = useNavigation();

  const menuItems: MenuGridItem[] = [
    {
      id: "2",
      title: "Acciones fallidas",
      icon: "error",
      onPress: () => navigation.navigate(AppScreen.DEAD_LETTER_QUEUE as never),
    },
    {
      id: "3",
      title: "Eventos",
      icon: "list",
      onPress: () => navigation.navigate(AppScreen.EVENTS as never),
    },
  ];

  return (
    <View className="flex-1">
      <AppBar
        background={{ surface: "brand" }}
        leading={
          <Display.Logo
            size="small"
            source={require("../../../../assets/TICKETS/wordmark.png")}
          />
        }
        title="Actividad"
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
