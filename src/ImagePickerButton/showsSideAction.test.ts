import { ImagePickerStatus } from './ImagePickerStatus';
import { resolveSideAction, showsSideAction } from './showsSideAction';

const action = { label: 'Remove background', hint: 'Opens the cut-out dialog', onPress: (): void => undefined };

describe('showsSideAction', () => {
  it('with an uploaded image and the opt-in action, shows it', () => {
    const status = ImagePickerStatus.Done;

    const shown = showsSideAction(status, action);

    expect(shown).toBe(true);
  });

  it('without the opt-in action, never shows it', () => {
    const status = ImagePickerStatus.Done;

    const shown = showsSideAction(status, undefined);

    expect(shown).toBe(false);
  });

  it('before an image exists or while uploading, hides it', () => {
    const statuses = [ImagePickerStatus.Idle, ImagePickerStatus.Uploading, ImagePickerStatus.Error];

    const shown = statuses.map((status) => showsSideAction(status, action));

    expect(shown).toEqual([false, false, false]);
  });
});

describe('resolveSideAction', () => {
  it('with a picked file held, enables the action with its own hint', () => {
    const withHint = { ...action, noFileHint: 'Pick a new photo first' };

    const state = resolveSideAction(withHint, true);

    expect(state).toEqual({ disabled: false, hint: 'Opens the cut-out dialog' });
  });

  it('with no file held and a noFileHint, disables the action and reads that hint', () => {
    const withHint = { ...action, noFileHint: 'Pick a new photo first' };

    const state = resolveSideAction(withHint, false);

    expect(state).toEqual({ disabled: true, hint: 'Pick a new photo first' });
  });

  it('with no file held and no noFileHint, keeps the action enabled as before', () => {
    const legacy = { ...action };

    const state = resolveSideAction(legacy, false);

    expect(state).toEqual({ disabled: false, hint: 'Opens the cut-out dialog' });
  });

  it('with the consumer disabling it, stays disabled even with a file', () => {
    const off = { ...action, disabled: true };

    const state = resolveSideAction(off, true);

    expect(state).toEqual({ disabled: true, hint: 'Opens the cut-out dialog' });
  });
});
