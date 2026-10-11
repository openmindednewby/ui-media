import { pickWebFile } from './pickWebFile';
import { DEFAULT_IMAGE_ACCEPT, pickWebImage } from '../ImagePickerButton/useImageUpload';

function captureInput(): { inputs: HTMLInputElement[]; restore: () => void } {
  const inputs: HTMLInputElement[] = [];
  const original = document.createElement.bind(document);
  const spy = jest.spyOn(document, 'createElement').mockImplementation((tag: string) => {
    const element = original(tag);
    if (element instanceof HTMLInputElement) {
      jest.spyOn(element, 'click').mockImplementation(() => undefined);
      inputs.push(element);
    }
    return element;
  });
  return { inputs, restore: () => spy.mockRestore() };
}

function selectFile(input: HTMLInputElement, file: File): void {
  Object.defineProperty(input, 'files', { value: [file] });
  input.dispatchEvent(new Event('change'));
}

describe('pickWebFile', () => {
  let capture: ReturnType<typeof captureInput>;

  beforeEach(() => {
    capture = captureInput();
  });

  afterEach(() => {
    capture.restore();
  });

  it('with a csv accept, opens a file input carrying that accept', () => {
    const accept = '.csv,text/csv';

    void pickWebFile(accept);

    const [input] = capture.inputs;
    expect(input.type).toBe('file');
    expect(input.accept).toBe(accept);
    expect(input.click).toHaveBeenCalledTimes(1);
  });

  it('when the user selects a file, resolves that file', async () => {
    const file = new File(['a,b'], 'rupep.csv', { type: 'text/csv' });
    const pending = pickWebFile('.csv');
    selectFile(capture.inputs[0], file);

    const result = await pending;

    expect(result).toBe(file);
  });

  it('when the user cancels the dialog, resolves null', async () => {
    const pending = pickWebFile('.zip');
    capture.inputs[0].dispatchEvent(new Event('cancel'));

    const result = await pending;

    expect(result).toBeNull();
  });

  it('when change fires with no file, resolves null', async () => {
    const pending = pickWebFile('*/*');
    capture.inputs[0].dispatchEvent(new Event('change'));

    const result = await pending;

    expect(result).toBeNull();
  });
});

describe('pickWebImage', () => {
  let capture: ReturnType<typeof captureInput>;

  beforeEach(() => {
    capture = captureInput();
  });

  afterEach(() => {
    capture.restore();
  });

  it('with no accept given, opens the dialog with the default image accept', () => {
    void pickWebImage();

    expect(capture.inputs[0].accept).toBe(DEFAULT_IMAGE_ACCEPT);
  });

  it('when the user selects an image, resolves that file', async () => {
    const file = new File(['x'], 'photo.png', { type: 'image/png' });
    const pending = pickWebImage('image/png');
    selectFile(capture.inputs[0], file);

    const result = await pending;

    expect(result).toBe(file);
  });
});
