const { createMoveHandle } = require('./utils');

module.exports = function (handles) {
  // 合并相同元素
  let start = null;
  let end = null;
  let currentKey = null;
  for (let i = 0; i < handles.length; i++) {
    const item = handles[i];
    if (item.handle === 'move' && (!currentKey || currentKey === item.key)) {
      if (start === null) {
        currentKey = item.key;
        start = i;
      }
      end = i;
    } else {
      combineSameItem(handles, start, end);
      i = start;
      start = null;
      end = null;
      currentKey = null;
    }
  }
  if (currentKey) {
    combineSameItem(handles, start, end);
    start = null;
    end = null;
    currentKey = null;
  }
};

/**
 * 合并相同的项
 * @param {*} handles
 * @param {*} start
 * @param {*} end
 */
function combineSameItem(handles, start, end) {
  if (end - start >= 1) {
    const startMove = handles[start];
    const endMove = handles[end];
    const item = handles[start].item;
    const move = createMoveHandle(item, startMove.key, 0, 0);
    const from = startMove.from;
    const to = endMove.to;
    move.from = from;
    move.to = to;

    handles.splice(start, end - start + 1, move);
  }
}
