import { MIN_TARGET_PX } from '@dloizides/ui-layout';

import { ZOOM_BUTTON_WIDTH, ZOOM_CELL_BASIS, zoomRowWidth } from './toolbarGeometry';

describe('ZOOM_CELL_BASIS', () => {
  it('with the zoom buttons at their rendered width, holds the whole zoom row', () => {
    const rowWidth = zoomRowWidth(ZOOM_BUTTON_WIDTH);

    const spare = ZOOM_CELL_BASIS - rowWidth;

    expect(spare).toBeGreaterThanOrEqual(0);
  });
});

describe('ZOOM_BUTTON_WIDTH', () => {
  it('with a 44 px touch floor, keeps each zoom step a full hit box', () => {
    const floor = MIN_TARGET_PX;

    const width = ZOOM_BUTTON_WIDTH;

    expect(width).toBeGreaterThanOrEqual(floor);
  });
});

describe('zoomRowWidth', () => {
  it('with 44 px buttons, returns two buttons plus the 52 px readout and two 8 px gaps', () => {
    const buttonWidth = 44;

    const width = zoomRowWidth(buttonWidth);

    expect(width).toBe(156);
  });
});
