const { withProjectBuildGradle } = require("expo/config-plugins");

const MARKER = "prefab-order-reanimated-worklets";

const SNIPPET = `
// ${MARKER}
// Expo runs Gradle with --configure-on-demand. CMake then reads the Reanimated
// and Worklets prefab folders before those tasks have created them.
subprojects { subproject ->
    subproject.tasks.configureEach { task ->
        def taskName = task.name
        if (!(taskName.startsWith("configureCMake") || taskName.startsWith("buildCMake") || taskName.startsWith("externalNativeBuild"))) {
            return
        }
        if (subproject.path == ":react-native-reanimated" || subproject.path == ":react-native-worklets") {
            return
        }
        def prefabTask = taskName.toLowerCase().contains("release") ? "prefabReleasePackage" : "prefabDebugPackage"
        task.dependsOn(":react-native-worklets:" + prefabTask)
        task.dependsOn(":react-native-reanimated:" + prefabTask)
    }
}
`;

function withPrefabOrder(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.contents.includes(MARKER)) {
      return config;
    }
    config.modResults.contents += SNIPPET;
    return config;
  });
}

module.exports = withPrefabOrder;
