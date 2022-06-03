// import foo from './deps.js';

module(['./dep.js'], function (imports) {
  const [foo] = imports;
  console.log('execute 1');
  console.log(foo);

  return {
    test: 'test',
  };
});
