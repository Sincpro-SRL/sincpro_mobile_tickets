import { createNavigationContainerRef, type ParamListBase } from "@react-navigation/native";

import { AppScreen } from "./AppScreen";

/** The app's navigator, so code outside the screens (device notices) can open a route. */
export const navigationRef = createNavigationContainerRef<ParamListBase>();

/**
 * Opens the screen behind a notice button. The framework only knows intents; the routes are
 * the host's: `printer` is the Impresora tab, `failed-prints` the prints that did not come out.
 */
export function openNoticeIntent(intent: string): void {
  if (!navigationRef.isReady()) return;
  if (intent === "printer") {
    navigationRef.navigate("Main", { screen: AppScreen.PRINTER });
  } else if (intent === "failed-prints") {
    navigationRef.navigate(AppScreen.FAILED_PRINTS);
  }
}
