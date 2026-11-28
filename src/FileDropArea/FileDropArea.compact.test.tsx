import { act, fireEvent, render, screen } from '@testing-library/react';

import { FileDropArea } from './FileDropArea';
import { FileDropLayout } from './FileDropLayout';
import { readClipboardFile } from './readClipboardFile';
import { pickWebFile } from '../pickWebFile/pickWebFile';

jest.mock('./useCanPasteFiles', () => ({ useCanPasteFiles: (): boolean => true }));
jest.mock('./readClipboardFile', () => ({ readClipboardFile: jest.fn() }));
jest.mock('../pickWebFile/pickWebFile', () => ({ pickWebFile: jest.fn() }));

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
const ACCEPT = ['application/pdf', 'image/png'];
const PNG = new File(['x'], 'shot.png', { type: 'image/png' });

function renderCompact(autoFocusChoose?: boolean): jest.Mock {
  const onFile = jest.fn();
  render(<FileDropArea accept={ACCEPT} autoFocusChoose={autoFocusChoose} file={null} labels={LABELS} layout={FileDropLayout.Compact} testID="area" onFile={onFile} onReject={jest.fn()} onRemove={jest.fn()} />);
  return onFile;
}

describe('FileDropArea compact layout', () => {
  beforeEach(() => {
    jest.mocked(pickWebFile).mockResolvedValue(PNG);
    jest.mocked(readClipboardFile).mockResolvedValue(PNG);
  });

  it('when the strip is pressed, picks a file of the accepted kinds and offers it', async () => {
    const onFile = renderCompact();

    await act(async () => { fireEvent.click(screen.getByTestId('area-zone-choose')); });

    expect([jest.mocked(pickWebFile).mock.calls[0]?.[0], onFile.mock.calls[0]?.[0]]).toEqual(['application/pdf,image/png', PNG]);
  });

  it('when paste is pressed, offers the clipboard file', async () => {
    const onFile = renderCompact();

    await act(async () => { fireEvent.click(screen.getByTestId('area-zone-paste')); });

    expect(onFile).toHaveBeenCalledWith(PNG);
  });

  it('when an accepted file is dropped, offers it', () => {
    const onFile = renderCompact();

    fireEvent.drop(screen.getByTestId('area'), { dataTransfer: { files: [PNG] } });

    expect(onFile).toHaveBeenCalledWith(PNG);
  });

  it('for screen readers, names the strip as the choose button with its hint', () => {
    renderCompact();

    const strip = screen.getByTestId('area-zone-choose');

    expect([strip.getAttribute('role'), strip.getAttribute('aria-label')]).toEqual(['button', 'Choose file']);
  });

  it('keeps the hint text on the strip', () => {
    renderCompact();

    const strip = screen.getByTestId('area-zone-choose');

    expect(strip.textContent).toContain('PDF, PNG or JPG');
  });

  it('with autoFocusChoose, focuses the strip on mount', () => {
    renderCompact(true);

    const active = document.activeElement;

    expect(active?.getAttribute('data-testid')).toBe('area-zone-choose');
  });

  it('while a file is dragged over, shows the drop prompt', () => {
    renderCompact();

    fireEvent.dragOver(screen.getByTestId('area'), { dataTransfer: { files: [] } });

    expect(screen.getByTestId('area-zone-prompt').textContent).toBe('Drop to add');
  });
});
