import { openCutout, registerCutoutHost } from './cutoutRegistry';
import type { CutoutRequest } from './cutoutRegistry';

const photo = (): Blob => new Blob(['photo'], { type: 'image/png' });

describe('openCutout', () => {
  it('with no CutoutHost mounted, rejects', async () => {
    const image = photo();

    const result = openCutout(image);

    await expect(result).rejects.toThrow('CutoutHost');
  });

  it('with a host mounted, hands the host the image', () => {
    const image = photo();
    const seen: Array<CutoutRequest | null> = [];
    const unregister = registerCutoutHost((request) => seen.push(request));

    void openCutout(image);

    expect(seen[0]?.image).toBe(image);
    unregister();
  });

  it('when the host resolves a blob, resolves it and clears the host', async () => {
    const cut = new Blob(['cut'], { type: 'image/png' });
    const seen: Array<CutoutRequest | null> = [];
    const unregister = registerCutoutHost((request) => seen.push(request));
    const pending = openCutout(photo());
    seen[0]?.resolve(cut);

    const result = await pending;

    expect([result, seen[1]]).toEqual([cut, null]);
    unregister();
  });

  it('with a second open while one is showing, resolves the first with null', async () => {
    const unregister = registerCutoutHost(() => undefined);
    const first = openCutout(photo());

    void openCutout(photo());

    await expect(first).resolves.toBeNull();
    unregister();
  });

  it('after the host unregisters, rejects again', async () => {
    const unregister = registerCutoutHost(() => undefined);
    unregister();

    const result = openCutout(photo());

    await expect(result).rejects.toThrow('CutoutHost');
  });
});
