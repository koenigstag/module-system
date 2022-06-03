function module(depsArray, moduleFunc) {
  System.register(depsArray ?? [], (_export, _context) => {
    const importsArray = [];
    return {
      setters: depsArray?.map((dep, idx) => (v) => (importsArray[idx] = v)),
      execute: async () => {
        const exportValue = await moduleFunc(importsArray, _context);
        _export(exportValue);
      },
    };
  });
}


