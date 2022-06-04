// import foo from './deps.js';

window.module(['./dep.js'], function (imports) {
  const foo = imports[0];
  console.log('execute 1');
  console.log('import', foo);

  return {
    test: 'test',
  };
});
