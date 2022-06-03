window.module(['./functions.js'], async function (imports) {
  const funcs = imports[0];
  console.log('execute 2');

  const exports = {
    value: funcs.myMath.sum(1, 2),
  };
  return exports;
});
