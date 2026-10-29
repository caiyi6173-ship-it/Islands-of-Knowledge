/* Math levels facade connecting to AtlasMathConsole */
(() => {
  function create(opts) {
    if (window.AtlasMathConsole && window.AtlasMathConsole.create) {
      return window.AtlasMathConsole.create(opts);
    }
    return null;
  }

  window.AtlasMathLevels = { create };
})();
