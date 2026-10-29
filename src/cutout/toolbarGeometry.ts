import { MIN_TARGET_PX } from '@dloizides/ui-layout';

export const TOOLBAR_GAP = 8;
export const ZOOM_READOUT_WIDTH = 52;

/** Width of the zoom row: two step buttons, the percent readout and the gaps between them. */
export const zoomRowWidth = (buttonWidth: number): number => buttonWidth * 2 + ZOOM_READOUT_WIDTH + TOOLBAR_GAP * 2;

/** Each zoom step is a square icon button at the 44 px touch floor, with no 100 px label floor. */
export const ZOOM_BUTTON_WIDTH = MIN_TARGET_PX;

export const ZOOM_CELL_BASIS = zoomRowWidth(ZOOM_BUTTON_WIDTH);
