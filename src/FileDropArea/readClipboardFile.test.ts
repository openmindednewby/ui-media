import { readClipboardFile } from './readClipboardFile';

function setClipboard(value: unknown): void {
  Object.defineProperty(navigator, 'clipboard', { value, configurable: true, writable: true });
}

describe('readClipboardFile', () => {
  it('with an image on the clipboard, returns it as a file of that type', async () => {
    const blob = new Blob(['x'], { type: 'image/png' });
    setClipboard({ read: jest.fn(async () => [{ types: ['text/plain', 'image/png'], getType: jest.fn(async () => blob) }]) });

    const file = await readClipboardFile();

    expect([file?.name, file?.type]).toEqual(['pasted.png', 'image/png']);
  });

  it('with only text on the clipboard, returns null', async () => {
    setClipboard({ read: jest.fn(async () => [{ types: ['text/plain'], getType: jest.fn() }]) });

    const file = await readClipboardFile();

    expect(file).toBeNull();
  });

  it('when reading is refused, returns null', async () => {
    setClipboard({ read: jest.fn(async () => Promise.reject(new Error('denied'))) });

    const file = await readClipboardFile();

    expect(file).toBeNull();
  });
});
