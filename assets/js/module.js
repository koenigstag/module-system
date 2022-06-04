function module(depsArray, moduleFunc) {
  const deps = depsArray ? depsArray : [];
  System.register(deps, function (_export, _context) {
    const importsArray = [];
    return {
      setters: depsArray
        ? depsArray.map(function (dep, idx) {
            return function (v) {
              importsArray[idx] = v;
            };
          })
        : undefined,
      execute: function () {
        return Promise.resolve()
          .then(function () {
            return moduleFunc(importsArray, _context);
          })
          .then(function (v) {
            _export(v);
          });
      },
    };
  });
}

window.module = module;
