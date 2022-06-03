module(['./functions.js'], async ([funcs]) => {
  console.log('execute 2');

  const exports = {
    value: funcs.myMath.sum(1, 2),
  };
  return exports;
});
