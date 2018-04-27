import * as util from '../utils';

describe('utils.flatten', () => {
  test('should flatten an 2D array', () => {
    const array = [[1], [2], [3]];
    expect(util.flatten(array)).toEqual([1, 2, 3]);
  });

  test('should flatten multidimensional array', () => {
    const array = [[1, [2]], [[3, [4]]]];
    expect(util.flatten(array)).toEqual([1, 2, 3, 4]);
  });
});
