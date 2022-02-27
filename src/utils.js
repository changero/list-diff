module.exports.mapListKey = function mapListKey(
  list,
  key = 'id',
  itemMap = false
) {
  return list.reduce((res, item, index) => {
    res[item[key]] = itemMap ? item : index;
    return res;
  }, {});
};

module.exports.createRemoveHandle = function createRemoveHandle(item, index) {
  return {
    item,
    handle: 'remove',
    index,
  };
};
module.exports.createAddHandle = function createAddHandle(item, index) {
  return {
    item,
    handle: 'add',
    index,
  };
};
module.exports.createMoveHandle = function createMoveHandle(
  item,
  key,
  from,
  to
) {
  return {
    item,
    key,
    handle: 'move',
    from,
    to,
  };
};
