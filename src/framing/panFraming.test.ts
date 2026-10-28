import { panFraming } from './panFraming';

describe('panFraming', () => {
  it('with a 50 px drag right on a 200 px box, moves x by 25%', () => {
    const start = { x: 0, y: 10, scale: 1.5 };

    const next = panFraming(start, { dx: 50, dy: 0 }, { width: 200, height: 300 });

    expect(next).toEqual({ x: 25, y: 10, scale: 1.5 });
  });

  it('with a drag past the bound, clamps to the landing bounds', () => {
    const start = { x: 50, y: -50, scale: 1 };

    const next = panFraming(start, { dx: 400, dy: -400 }, { width: 100, height: 100 });

    expect(next).toEqual({ x: 60, y: -60, scale: 1 });
  });

  it('with a box not yet measured, returns the clamped start', () => {
    const start = { x: 5, y: 5, scale: 1 };

    const next = panFraming(start, { dx: 30, dy: 30 }, { width: 0, height: 0 });

    expect(next).toEqual(start);
  });

  it('with a fractional drag, rounds to three decimals', () => {
    const start = { x: 0, y: 0, scale: 1 };

    const next = panFraming(start, { dx: 1, dy: 1 }, { width: 3, height: 3 });

    expect(next).toEqual({ x: 33.333, y: 33.333, scale: 1 });
  });
});
