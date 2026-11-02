import { render } from '@testing-library/react';

import { ImagePickerButton, resolvePickerView } from './ImagePickerButton';
import { ImagePickerStatus } from './ImagePickerStatus';

const mockButton = jest.fn();

jest.mock('@dloizides/ui-buttons', () => ({
  Button: (props: { variant: string }): null => {
    mockButton(props.variant);
    return null;
  },
}));

const labels = {
  pick: 'Add',
  uploading: 'Uploading',
  replace: 'Replace',
  retry: 'Retry',
  done: 'Saved',
  error: 'Failed',
  hint: 'Opens a file picker',
};

const upload = async (): Promise<void> => undefined;

describe('resolvePickerView', () => {
  it('with no idle variant, keeps idle primary', () => {
    const status = ImagePickerStatus.Idle;

    const view = resolvePickerView(status, labels);

    expect(view.variant).toBe('primary');
  });

  it('with an idle variant, uses it for idle', () => {
    const status = ImagePickerStatus.Idle;

    const view = resolvePickerView(status, labels, 'outline');

    expect(view.variant).toBe('outline');
  });

  it('with an idle variant, leaves uploading, error and done on their own variants', () => {
    const statuses = [ImagePickerStatus.Uploading, ImagePickerStatus.Error, ImagePickerStatus.Done];

    const variants = statuses.map((status) => resolvePickerView(status, labels, 'ghost').variant);

    expect(variants).toEqual(['outline', 'danger', 'outline']);
  });
});

describe('ImagePickerButton', () => {
  beforeEach(() => mockButton.mockClear());

  it('with idleVariant, paints the idle button in that variant', () => {
    const idleVariant = 'outline';

    render(<ImagePickerButton idleVariant={idleVariant} labels={labels} testID="picker" upload={upload} />);

    expect(mockButton).toHaveBeenLastCalledWith('outline');
  });

  it('without idleVariant, paints the idle button primary', () => {
    const props = { labels, testID: 'picker', upload };

    render(<ImagePickerButton {...props} />);

    expect(mockButton).toHaveBeenLastCalledWith('primary');
  });
});
