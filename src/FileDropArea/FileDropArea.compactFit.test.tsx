import { render } from '@testing-library/react';
import { Text } from 'react-native';

import type { TextProps } from 'react-native';

import { Button } from '@dloizides/ui-buttons';

import { FileDropArea } from './FileDropArea';
import { FileDropLayout } from './FileDropLayout';

jest.mock('./useCanPasteFiles', () => ({ useCanPasteFiles: (): boolean => true }));
jest.mock('react-native', () => {
  const actual = jest.requireActual<typeof import('react-native')>('react-native');
  const react = jest.requireActual<typeof import('react')>('react');
  return { ...actual, Text: jest.fn((props: TextProps) => react.createElement(actual.Text, props)) };
});
jest.mock('@dloizides/ui-buttons', () => {
  const actual = jest.requireActual<typeof import('@dloizides/ui-buttons')>('@dloizides/ui-buttons');
  return { ...actual, Button: jest.fn(actual.Button) };
});

const LONG = 'Answers, screenshots, PDFs. Each file is copied into this engagement and recorded in its ledger.';
const LABELS = {
  prompt: 'Drop a returned file here',
  dropPrompt: 'Drop it here',
  hint: LONG,
  choose: 'Choose file',
  chooseHint: 'Opens the file picker',
  paste: 'Paste',
  pasteHint: 'Pastes a copied file',
  remove: 'Remove',
  removeHint: 'Removes the file',
  preview: 'Chosen file',
};
const TWO_LINES = 2;

function renderCompact(): void {
  render(<FileDropArea accept={['image/png']} file={null} labels={LABELS} layout={FileDropLayout.Compact} testID="area" onFile={jest.fn()} onReject={jest.fn()} onRemove={jest.fn()} />);
}

describe('CompactDropZone', () => {
  it('with onPaste, renders Paste as the shared Button at the 44px sm size', () => {
    renderCompact();

    const props = jest.mocked(Button).mock.calls.map(([p]) => p).find((p) => p.testID === 'area-zone-paste');

    expect([props?.size, props?.label]).toEqual(['sm', 'Paste']);
  });

  it('with a long prompt and hint, caps each at two lines', () => {
    renderCompact();

    const clamps = ['area-zone-prompt', 'area-zone-hint'].map((id) => (Text as unknown as jest.Mock<unknown, [TextProps]>).mock.calls.map(([p]) => p).find((p) => p.testID === id)?.numberOfLines);

    expect(clamps).toEqual([TWO_LINES, TWO_LINES]);
  });
});
