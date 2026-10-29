/* Compatibility entry: all subjects use the Physics cutscene player. */
(() => {
  window.AtlasMathLevelIntro = {
    create: (options) => window.AtlasSubjectLevels.createIntro(options, "M"),
  };
})();
