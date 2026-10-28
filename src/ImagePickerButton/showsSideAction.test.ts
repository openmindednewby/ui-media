import { ImagePickerStatus } from './ImagePickerStatus';
import { showsSideAction } from './showsSideAction';

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
