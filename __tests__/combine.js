const { diffAndCombine, diff } = require('../index');
const { getRemove, getAdd, getMove } = require('./__ignore__/common');

describe('combine diff', () => {
  it('combine', () => {
    var oldList = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    var newList = [{ id: 'b' }, { id: 'c' }, { id: 'a' }];
    const handles = diffAndCombine(oldList, newList);
    // console.log(handles);
    expect(handles.length).toBe(1);
    const moveHandles = getMove(handles);
    expect(moveHandles.length).toBe(1);

    expect(moveHandles[0].from).toBe(0);
    expect(moveHandles[0].to).toBe(2);
  });

  it('combine 2 times', () => {
    var oldList = [
      { id: 'a' },
      { id: 'b' },
      { id: 'c' },
      { id: 'd' },
      { id: 'e' },
      { id: 'f' },
    ];
    var newList = [
      { id: 'b' },
      { id: 'c' },
      { id: 'a' },
      { id: 'e' },
      { id: 'f' },
      { id: 'd' },
    ];
    const handles = diffAndCombine(oldList, newList);
    // console.log(handles);
    expect(handles.length).toBe(2);
    const moveHandles = getMove(handles);
    expect(moveHandles.length).toBe(2);

    expect(moveHandles[0].from).toBe(0);
    expect(moveHandles[0].to).toBe(2);
    expect(moveHandles[1].from).toBe(3);
    expect(moveHandles[1].to).toBe(5);
  });

  it('combine step gt 1', () => {
    var oldList = [
      { id: 'a' },
      { id: 'b' },
      { id: 'c' },
      { id: 'd' },
      { id: 'e' },
    ];
    var newList = [
      { id: 'c' },
      { id: 'd' },
      { id: 'e' },
      { id: 'a' },
      { id: 'b' },
    ];

    const handles = diffAndCombine(oldList, newList);
    // console.log(handles);
    expect(handles.length).toBe(2);
    const moveHandles = getMove(handles);
    expect(moveHandles.length).toBe(2);

    expect(moveHandles[0].from).toBe(0);
    expect(moveHandles[0].to).toBe(4);

    expect(moveHandles[1].from).toBe(0);
    expect(moveHandles[1].to).toBe(4);
  });

  it('combine same ', () => {
    var oldList = [
      { id: 'a' },
      { id: 'b' },
      { id: 'c' },
      { id: 'd' },
      { id: 'e' },
    ];
    var newList = [
      { id: 'c' },
      { id: 'd' },
      { id: 'e' },
      { id: 'b' },
      { id: 'a' },
    ];

    const handles = diffAndCombine(oldList, newList);
    // console.log(handles);
    expect(handles.length).toBe(2);
    const moveHandles = getMove(handles);
    expect(moveHandles.length).toBe(2);

    expect(moveHandles[0].from).toBe(0);
    expect(moveHandles[0].to).toBe(4);

    expect(moveHandles[1].from).toBe(0);
    expect(moveHandles[1].to).toBe(3);
  });
});
