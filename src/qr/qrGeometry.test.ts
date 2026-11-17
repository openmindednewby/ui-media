import { buildQrGeometry } from './qrGeometry';

describe('buildQrGeometry', () => {
  it('with an empty text, returns an empty path and size 0', () => {
    const text = '';

    const geometry = buildQrGeometry(text);

    expect(geometry).toEqual({ path: '', size: 0 });
  });

  it('with a hosted-flow URL, returns a path and a size of the module count plus two quiet zones of 4', () => {
    const text = 'https://verify.example.test/s/abc123';

    const geometry = buildQrGeometry(text);

    expect(geometry.path.startsWith('M4 4h7v1h-7z')).toBe(true);
    expect((geometry.size - 8 - 21) % 4).toBe(0);
  });
});
