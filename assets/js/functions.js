// module(imports[], function(importedValues[]) { return 'export'; });
window.module(null, function () {
  // export
  return {
    myMath: {
      sum(a, b) {
        return a + b;
      },
    }
  };
});
