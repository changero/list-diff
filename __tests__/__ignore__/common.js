function filter(handle) {
  return function (handles) {
    return handles.filter((h) => h.handle === handle);
  };
}
module.exports.getRemove = filter('remove');
module.exports.getAdd = filter('add');
module.exports.getMove = filter('move');
