const { diff } = require('../index');
const { getRemove, getAdd, getMove } = require('./__ignore__/common');

describe('simple diff', () => {
  it('only delete', () => {
    var oldList = [{ id: 'a' }, { id: 'b' }];
    var newList = [];
    const handles = diff(oldList, newList);
    // console.log(handles);
    expect(handles.length).toBe(2);
    const removeHandles = getRemove(handles);
    expect(removeHandles.length).toBe(2);
    removeHandles.forEach((handle) => {
      expect(handle.index).toBe(0);
    });
  });

  it('only add', () => {
    var oldList = [];
    var newList = [{ id: 'a' }, { id: 'b' }];
    const handles = diff(oldList, newList);
    // console.log(handles);
    expect(handles.length).toBe(2);
    const addHandles = getAdd(handles);
    expect(addHandles.length).toBe(2);
    addHandles.forEach((handle, index) => {
      expect(handle.index).toBe(index);
    });
  });

  it('delete and add', () => {
    var oldList = [{ id: 'a' }, { id: 'b' }];
    var newList = [{ id: 'c' }];
    const handles = diff(oldList, newList);
    // console.log(handles);
    expect(handles.length).toBe(3);
    const removeHandles = getRemove(handles);
    expect(removeHandles.length).toBe(2);
    const addHandles = getAdd(handles);
    expect(addHandles.length).toBe(1);
  });
});

describe('diff move', () => {
  it('continuity move', () => {
    var oldList = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
    var newList = [{ id: 'b' }, { id: 'c' }, { id: 'a' }, { id: 'd' }];

    const handles = diff(oldList, newList);
    // console.log(handles);
    expect(handles.length).toBe(2);
    const moveHandles = getMove(handles);
    expect(moveHandles.length).toBe(2);

    expect(moveHandles[0].from).toBe(1);
    expect(moveHandles[0].to).toBe(0);

    expect(moveHandles[1].from).toBe(2);
    expect(moveHandles[1].to).toBe(1);
  });

  it('continuity move and delete', () => {
    var oldList = [
      { id: 'x' },
      { id: 'a' },
      { id: 'b' },
      { id: 'c' },
      { id: 'd' },
    ];
    var newList = [{ id: 'b' }, { id: 'c' }, { id: 'x' }, { id: 'd' }];

    const handles = diff(oldList, newList);
    // console.log(handles);
    expect(handles.length).toBe(3);
    const removeHandles = getRemove(handles);
    expect(removeHandles.length).toBe(1);
    expect(removeHandles[0].index).toBe(1);

    const moveHandles = getMove(handles);
    expect(moveHandles.length).toBe(2);

    expect(moveHandles[0].from).toBe(1);
    expect(moveHandles[0].to).toBe(0);

    expect(moveHandles[1].from).toBe(2);
    expect(moveHandles[1].to).toBe(1);
  });

  it('continuity move and add', () => {
    var oldList = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
    var newList = [
      { id: 'b' },
      { id: 'c' },
      { id: 'x' },
      { id: 'a' },
      { id: 'd' },
    ];

    const handles = diff(oldList, newList);
    // console.log(handles);
    expect(handles.length).toBe(3);
    const moveHandles = getMove(handles);
    expect(moveHandles.length).toBe(2);

    expect(moveHandles[0].from).toBe(1);
    expect(moveHandles[0].to).toBe(0);

    expect(moveHandles[1].from).toBe(2);
    expect(moveHandles[1].to).toBe(1);

    const addHandles = getAdd(handles);
    expect(addHandles.length).toBe(1);
    expect(addHandles[0].index).toBe(2);
  });

  it('continuity move and delete and add', () => {
    var oldList = [
      { id: 'x' },
      { id: 'a' },
      { id: 'b' },
      { id: 'c' },
      { id: 'd' },
    ];
    var newList = [
      { id: 'b' },
      { id: 'c' },
      { id: 'e' },
      { id: 'x' },
      { id: 'd' },
    ];

    const handles = diff(oldList, newList);
    // console.log(handles);
    expect(handles.length).toBe(4);
    const removeHandles = getRemove(handles);
    expect(removeHandles.length).toBe(1);
    expect(removeHandles[0].index).toBe(1);

    const moveHandles = getMove(handles);
    expect(moveHandles.length).toBe(2);

    expect(moveHandles[0].from).toBe(1);
    expect(moveHandles[0].to).toBe(0);

    expect(moveHandles[1].from).toBe(2);
    expect(moveHandles[1].to).toBe(1);

    const addHandles = getAdd(handles);
    expect(addHandles.length).toBe(1);
    expect(addHandles[0].index).toBe(2);
  });

  it('fork move', () => {
    var oldList = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
    var newList = [{ id: 'b' }, { id: 'd' }, { id: 'c' }, { id: 'a' }];

    const handles = diff(oldList, newList);
    // console.log(handles);
    expect(handles.length).toBe(3);
    const moveHandles = getMove(handles);
    expect(moveHandles.length).toBe(3);

    expect(moveHandles[0].from).toBe(1);
    expect(moveHandles[0].to).toBe(0);

    expect(moveHandles[1].from).toBe(3);
    expect(moveHandles[1].to).toBe(1);

    expect(moveHandles[2].from).toBe(3);
    expect(moveHandles[2].to).toBe(2);
  });

  it('fork move and delete', () => {
    var oldList = [
      { id: 'a' },
      { id: 'b' },
      { id: 'c' },
      { id: 'd' },
      { id: 'x' },
    ];
    var newList = [{ id: 'b' }, { id: 'd' }, { id: 'c' }, { id: 'a' }];

    const handles = diff(oldList, newList);
    // console.log(handles);
    expect(handles.length).toBe(4);
    const moveHandles = getMove(handles);
    expect(moveHandles.length).toBe(3);

    expect(moveHandles[0].from).toBe(1);
    expect(moveHandles[0].to).toBe(0);

    expect(moveHandles[1].from).toBe(3);
    expect(moveHandles[1].to).toBe(1);

    expect(moveHandles[2].from).toBe(3);
    expect(moveHandles[2].to).toBe(2);

    const removeHandles = getRemove(handles);
    expect(removeHandles.length).toBe(1);
    expect(removeHandles[0].index).toBe(4);
  });

  it('fork move and add', () => {
    var oldList = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
    var newList = [
      { id: 'b' },
      { id: 'd' },
      { id: 'c' },
      { id: 'a' },
      { id: 'x' },
    ];

    const handles = diff(oldList, newList);
    // console.log(handles);
    expect(handles.length).toBe(4);
    const moveHandles = getMove(handles);
    expect(moveHandles.length).toBe(3);

    expect(moveHandles[0].from).toBe(1);
    expect(moveHandles[0].to).toBe(0);

    expect(moveHandles[1].from).toBe(3);
    expect(moveHandles[1].to).toBe(1);

    expect(moveHandles[2].from).toBe(3);
    expect(moveHandles[2].to).toBe(2);

    const addHandles = getAdd(handles);
    expect(addHandles.length).toBe(1);
    expect(addHandles[0].index).toBe(4);
  });

  it('fork move and delete and add', () => {
    var oldList = [
      { id: 'y' },
      { id: 'a' },
      { id: 'b' },
      { id: 'c' },
      { id: 'd' },
    ];
    var newList = [
      { id: 'b' },
      { id: 'd' },
      { id: 'c' },
      { id: 'a' },
      { id: 'x' },
    ];

    const handles = diff(oldList, newList);
    // console.log(handles);
    expect(handles.length).toBe(5);
    const moveHandles = getMove(handles);
    expect(moveHandles.length).toBe(3);

    expect(moveHandles[0].from).toBe(1);
    expect(moveHandles[0].to).toBe(0);

    expect(moveHandles[1].from).toBe(3);
    expect(moveHandles[1].to).toBe(1);

    expect(moveHandles[2].from).toBe(3);
    expect(moveHandles[2].to).toBe(2);

    const addHandles = getAdd(handles);
    expect(addHandles.length).toBe(1);
    expect(addHandles[0].index).toBe(4);

    const removeHandles = getRemove(handles);
    expect(removeHandles.length).toBe(1);
    expect(removeHandles[0].index).toBe(0);
  });
});
