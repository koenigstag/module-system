// module(imports[], function(importedValues[]) { return 'export'; });
module(null, function () {
  // export
  return {
    myMath: {
      sum(a, b) {
        return a + b;
      },
    }
  };
});
