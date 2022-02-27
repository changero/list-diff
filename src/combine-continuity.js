const { createMoveHandle } = require('./utils');

module.exports = function (list, handles, key) {
  // 合并handles
  // 对于连续move相同步数的操作，可以合并为，将第一个元素的to移动到最后一个元素的from
  let step = null;
  const moves = [];
  let from = null;
  for (let i = 0; i < handles.length; i++) {
    const item = handles[i];
    // 访问到需要移动的元素 并且 当前是第一个  或者步长与之前的元素相同的时候直接入队列
    if (item.handle === 'move' && (!step || item.from - item.to === step)) {
      if (!moves.length || item.from - from === 1) {
        const s = item.from - item.to;
        // 只收集向前移动
        if (s > 0) {
          step = s;
          from = item.from;
          moves.push(item);
          continue;
        }
      }
    }
    if (moves.length) {
      const ml = combineContinuityItem(list, handles, moves, key, step, i);
      i -= ml; // 将标记重新移动到第一个元素的位置，因为那将是合并之后的地方
      step = null;
      from = null;
      moves.length = 0;
    }
  }
  if (moves.length) {
    combineContinuityItem(list, handles, moves, key, step, handles.length);
    step = null;
    from = null;
    moves.length = 0;
  }
};

/**
 * 合并连续项
 * @param {*} list 目标数组
 * @param {*} target 所有操作
 * @param {*} moves 需要合并的操作
 * @param {*} key 唯一标识字段
 * @param {*} step 移动的步数，需要保证移动的个数大于步数才做合并，因为步数就是合并之后的个数
 * @param {*} current 当前位置
 * 从target里面合并moves
 * target [ 1, 2, 3, 4 ]
 *             ----  |
 *              | current
 *              |
 *             moves
 *
 * 合并后 [ 1, 6, 4]
 *            |
 *         current
 */
function combineContinuityItem(list, target, moves, key, step, current) {
  const ml = moves.length;
  // step>0：从后往前移动
  if (step > 0 && ml > step) {
    let from = Infinity;
    let end = null;
    moves.forEach((move) => {
      from = Math.min(from, move.to);
    });
    // 找到最后一个元素的索引
    // 相当于找到moves最大的from
    end = from + ml + step - 1;
    // 从start开始，把step个元素往后移动，创建movehandle
    const newMoveHandle = [];
    for (let i = 0; i < step; i++) {
      const moveItem = list[from + i];
      newMoveHandle.push(createMoveHandle(moveItem, moveItem[key], from, end));
    }
    target.splice(current - ml, ml, ...newMoveHandle);
  }
  return ml;
}
