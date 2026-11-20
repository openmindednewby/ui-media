import { pageSize } from './pdfScale';

describe('pageSize', () => {
  it('with an A4 page at half its width on a 2x screen, draws at scale 1 and halves the height', () => {
    const a4Width = 595;
    const a4Height = 842;

    const size = pageSize(a4Width, a4Height, 297.5, 2);

    expect(size).toEqual({ scale: 1, height: 421 });
  });

  it('with a pixel ratio below 1, never draws below the fit scale', () => {
    const pageWidth = 600;

    const size = pageSize(pageWidth, 800, 300, 0.5);

    expect(size.scale).toBe(0.5);
  });
});
