// creteModule(fileName, imports[], function(importedValues[]) { return 'export'; });
defineModule('functions', null, function () {
  // export
  return {
    myMath: {
      sum(a, b) {
        return a + b;
      },
    }
  };
});
