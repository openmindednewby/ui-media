import { drawPage } from './drawPage';
import { PageDrawStatus } from './PageDrawStatus';

describe('drawPage', () => {
  it('with a render that rejects, settles to Failed instead of staying blank', async () => {
    const draw = async (): Promise<never> => Promise.reject(new Error('worker failed to load'));

    const result = await drawPage(draw);

    expect(result).toEqual({ status: PageDrawStatus.Failed, image: null });
  });

  it('with a render that resolves, settles to Drawn with its image', async () => {
    const image = { url: 'blob:page-1', height: 421 };

    const result = await drawPage(async () => Promise.resolve(image));

    expect(result).toEqual({ status: PageDrawStatus.Drawn, image });
  });
});
