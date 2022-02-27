const {
  createRemoveHandle,
  createAddHandle,
  createMoveHandle,
  mapListKey,
} = require('./utils');

const combineContinuity = require('./combine-continuity');
const combineSame = require('./combine-same');

const diff = (module.exports.diff = function diff(list, nextList, key) {
  const oldKeyMap = mapListKey(list); // {a: 0, b: 1}
  const itemMap = mapListKey(list, 'id', true);

  const keyMap = mapListKey(nextList);
  const handles = [];

  // 标记删除的元素个数
  // 在删除的元素之后，索引值需要响应的减掉deleteCount，来得到此时的index
  let deleteCount = 0;
  Object.keys(oldKeyMap).forEach((key) => {
    const index = oldKeyMap[key];
    const currentIndex = index - deleteCount;
    if (!keyMap.hasOwnProperty(key)) {
      // 标记删除元素
      handles.push(createRemoveHandle(list[index], currentIndex));
      deleteCount++;
      delete oldKeyMap[key];
    } else {
      oldKeyMap[key] = currentIndex;
    }
  });

  // 标记新增的个数
  // 在之后的元素索引都要相应的加addCount
  let addCount = 0;
  // // 保存移动的元素的索引，比这些索引小的元素，在计算当前实际索引的时候
  // // 要加上相应的个数，实际就是加上比当前索引值小的个数
  const moveArray = [];
  // 遍历结果数组
  // 找到新增和修改的元素
  Object.keys(keyMap).forEach((key) => {
    // 当前索引
    const index = keyMap[key];
    if (!oldKeyMap.hasOwnProperty(key)) {
      // 标记新增元素
      handles.push(createAddHandle(nextList[index], index));
      addCount++;
    } else {
      // 都是已存在的元素 调整位置
      // 在这个diff过程中，元素一定都是往前移动，也就是原始索引在现在索引的后面
      // 因此不可能出现在新的结构中，某个数据的索引比原始索引值还要大
      // 因为这是一个动态调节的过程
      let oldIndex = oldKeyMap[key];
      const moveBack = moveArray.reduce((count, [from, to]) => {
        if (from > oldIndex && to <= oldIndex) {
          count++;
          oldIndex++;
        }
        return count;
      }, 0);
      const currentOldIndex = oldIndex + addCount;
      if (currentOldIndex > index) {
        handles.push(
          createMoveHandle(itemMap[key], key, currentOldIndex, index)
        );
        moveArray.push([currentOldIndex, index]);
      }
    }
  });

  return handles;
});

module.exports.diffAndCombine = function diffAndCombine(
  list,
  nextList,
  key = 'id'
) {
  const handles = diff(list, nextList, key);
  if (handles.some((handle) => handle.handle === 'move')) {
    // 合并连续项

    combineContinuity(list, handles, key);
    combineSame(handles);
  }

  return handles;
};
