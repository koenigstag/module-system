// import foo from './deps.js';

System.register(['./dep.js'], function (_export, _context) {
  const imports = {
    dep: null,
  };

  return {
    setters: [
      (value) => imports.dep = value,
    ],
    execute: function () {
      console.log('execute 1');
      console.log(imports.dep);

      _export({
        value: 'value',
      });
    },
  };
});
