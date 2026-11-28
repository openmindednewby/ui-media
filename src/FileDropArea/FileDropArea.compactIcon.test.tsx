import { render, screen } from '@testing-library/react';

import { FileDropArea } from './FileDropArea';
import { FileDropLayout } from './FileDropLayout';

jest.mock('./useCanPasteFiles', () => ({ useCanPasteFiles: (): boolean => true }));

const LABELS = {
  prompt: 'Drop a file here',
  dropPrompt: 'Drop to add',
  hint: 'PDF, PNG or JPG',
  choose: 'Choose file',
  chooseHint: 'Opens the file picker',
  paste: 'Paste',
  pasteHint: 'Pastes from the clipboard',
  remove: 'Remove',
  removeHint: 'Removes the file',
  preview: 'Chosen file',
};

function renderArea(layout: FileDropLayout): void {
  render(<FileDropArea accept={['image/png']} file={null} labels={LABELS} layout={layout} testID="area" onFile={jest.fn()} onReject={jest.fn()} onRemove={jest.fn()} />);
}

describe('FileDropArea compact upload icon', () => {
  it('in the compact layout, leads the choose strip with the upload icon', () => {
    renderArea(FileDropLayout.Compact);

    const strip = screen.getByTestId('area-zone-choose');

    expect(strip.firstElementChild?.getAttribute('data-testid')).toBe('area-zone-icon');
  });

  it('in the compact layout, hides the upload icon from screen readers', () => {
    renderArea(FileDropLayout.Compact);

    const icon = screen.getByTestId('area-zone-icon');

    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });

  it('in the compact layout, keeps the strip name free of icon text', () => {
    renderArea(FileDropLayout.Compact);

    const icon = screen.getByTestId('area-zone-icon');

    expect(icon.textContent).toBe('');
  });

  it('in the full layout, renders no compact icon', () => {
    renderArea(FileDropLayout.Full);

    const icon = screen.queryByTestId('area-zone-icon');

    expect(icon).toBeNull();
  });
});
