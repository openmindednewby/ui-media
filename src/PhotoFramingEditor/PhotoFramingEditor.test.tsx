import { fireEvent, render, screen } from '@testing-library/react';

import { FramingAction } from '../framing/FramingAction';
import { PhotoFramingEditor } from './PhotoFramingEditor';
import type { PhotoFramingLabels, PhotoFramingPreviewArgs } from './types';

const action = (label: string): { label: string; hint: string } => ({ label, hint: `${label} hint` });

const LABELS: PhotoFramingLabels = {
  size: 'Size',
  position: 'Position',
  scaleValue: (p) => `${p}%`,
  actions: {
    [FramingAction.ZoomIn]: action('zoom in'),
    [FramingAction.ZoomOut]: action('zoom out'),
    [FramingAction.MoveUp]: action('up'),
    [FramingAction.MoveDown]: action('down'),
    [FramingAction.MoveLeft]: action('left'),
    [FramingAction.MoveRight]: action('right'),
    [FramingAction.Reset]: action('reset'),
  },
};

const setup = (value: { x?: number; y?: number; scale?: number } | null) => {
  const onChange = jest.fn();
  const renderPreview = jest.fn((_args: PhotoFramingPreviewArgs) => null);
  render(
    <PhotoFramingEditor
      labels={LABELS}
      renderPreview={renderPreview}
      testID="fe"
      value={value}
      onChange={onChange}
    />,
  );
  return { onChange, renderPreview };
};

describe('PhotoFramingEditor', () => {
  it('emits the stepped value when a control is pressed', () => {
    const { onChange } = setup({ x: 0, y: 0, scale: 1 });
    fireEvent.click(screen.getByTestId('fe-zoomIn'));
    expect(onChange).toHaveBeenLastCalledWith({ x: 0, y: 0, scale: 1.1 });
    fireEvent.click(screen.getByTestId('fe-moveLeft'));
    expect(onChange).toHaveBeenLastCalledWith({ x: -5, y: 0, scale: 1 });
  });

  it('does not emit for a control at its bound', () => {
    const { onChange } = setup({ x: 0, y: 0, scale: 3 });
    fireEvent.click(screen.getByTestId('fe-zoomIn'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('hands the preview the clamped framing and its transform', () => {
    const { renderPreview } = setup({ x: 999, y: -5, scale: 1.2 });
    expect(renderPreview).toHaveBeenLastCalledWith({
      framing: { x: 60, y: -5, scale: 1.2 },
      transform: [{ translateX: '60%' }, { translateY: '-5%' }, { scale: 1.2 }],
    });
    expect(screen.getByTestId('fe-scale').textContent).toBe('120%');
  });

  it('resets to the default framing', () => {
    const { onChange } = setup({ x: 10, y: 10, scale: 2 });
    fireEvent.click(screen.getByTestId('fe-reset'));
    expect(onChange).toHaveBeenLastCalledWith({ x: 0, y: 0, scale: 1 });
  });
});
