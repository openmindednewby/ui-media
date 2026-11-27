import { fireEvent, render, screen } from '@testing-library/react';

import { FileDropArea } from './FileDropArea';

const LABELS = {
  prompt: 'Paste or choose a file',
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
const ACCEPT = ['application/pdf', 'image/png', 'image/jpeg'];
const PNG = new File(['x'], 'shot.png', { type: 'image/png' });
const DOCX = new File(['x'], 'note.docx', { type: 'application/msword' });

interface Handlers {
  onFile: jest.Mock;
  onReject: jest.Mock;
  onRemove: jest.Mock;
}

function renderArea(file: File | null = null, autoFocusChoose?: boolean): Handlers {
  const handlers = { onFile: jest.fn(), onReject: jest.fn(), onRemove: jest.fn() };
  render(<FileDropArea accept={ACCEPT} autoFocusChoose={autoFocusChoose} file={file} labels={LABELS} testID="area" {...handlers} />);
  return handlers;
}

describe('FileDropArea', () => {
  it('when an accepted file is dropped, offers it', () => {
    const { onFile } = renderArea();

    fireEvent.drop(screen.getByTestId('area'), { dataTransfer: { files: [PNG] } });

    expect(onFile).toHaveBeenCalledWith(PNG);
  });

  it('when a file outside accept is dropped, rejects it instead', () => {
    const { onFile, onReject } = renderArea();

    fireEvent.drop(screen.getByTestId('area'), { dataTransfer: { files: [DOCX] } });

    expect([onFile.mock.calls.length, onReject.mock.calls[0]?.[0]]).toEqual([0, DOCX]);
  });

  it('when a file is pasted on the page, offers it', () => {
    const { onFile } = renderArea();

    fireEvent.paste(document, { clipboardData: { files: [PNG] } });

    expect(onFile).toHaveBeenCalledWith(PNG);
  });

  it('when text is pasted, offers nothing', () => {
    const { onFile, onReject } = renderArea();

    fireEvent.paste(document, { clipboardData: { files: [] } });

    expect([onFile.mock.calls.length, onReject.mock.calls.length]).toEqual([0, 0]);
  });

  it('with a link pasted on the page and onPasteText given, passes the link to it', () => {
    const onPasteText = jest.fn();
    render(<FileDropArea accept={ACCEPT} file={null} labels={LABELS} testID="area" onFile={jest.fn()} onPasteText={onPasteText} onReject={jest.fn()} onRemove={jest.fn()} />);

    fireEvent.paste(document, { clipboardData: { files: [], getData: () => 'blob:https://bank.example/1' } });

    expect(onPasteText).toHaveBeenCalledWith('blob:https://bank.example/1');
  });

  it('while a file is dragged over, shows the drop prompt', () => {
    renderArea();

    fireEvent.dragOver(screen.getByTestId('area'), { dataTransfer: { files: [] } });

    expect(screen.getByTestId('area-zone-prompt').textContent).toBe('Drop to add');
  });

  it('with a file chosen, pressing remove calls onRemove', () => {
    const { onRemove } = renderArea(PNG);

    fireEvent.click(screen.getByTestId('area-preview-remove'));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('with autoFocusChoose, focuses the choose button on mount', () => {
    renderArea(null, true);

    const active = document.activeElement;

    expect(active?.getAttribute('data-testid')).toBe('area-zone-choose');
  });

  it('without autoFocusChoose, leaves focus where it was', () => {
    renderArea();

    const active = document.activeElement;

    expect(active).toBe(document.body);
  });
});
