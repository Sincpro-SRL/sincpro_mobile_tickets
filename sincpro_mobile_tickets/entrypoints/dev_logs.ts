import { LogBox } from "react-native";

// react-native-css-interop (NativeWind v4) registers ImageBackground while it loads, which fires RN 0.88's
// deprecation warning on every launch even though the app never renders it. Only that message is muted.
// Imported first in index.ts: the warning happens at import time, before any app code runs.
LogBox.ignoreLogs(["ImageBackground is deprecated"]);
