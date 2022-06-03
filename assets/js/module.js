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
      execute: async function () {
        const exportValue = await moduleFunc(importsArray, _context);
        _export(exportValue);
      },
    };
  });
}

window.module = module;
