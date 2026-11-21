import { canReadClipboardFiles } from './canReadClipboardFiles';

const read = (): Promise<never[]> => Promise.resolve([]);

describe('canReadClipboardFiles', () => {
  it('on web with clipboard.read and no permission answer, returns true', () => {
    const env = { platform: 'web', clipboard: { read } };

    const result = canReadClipboardFiles(env);

    expect(result).toBe(true);
  });

  it('on web with clipboard.read and permission granted, returns true', () => {
    const env = { platform: 'web', clipboard: { read }, permission: 'granted' };

    const result = canReadClipboardFiles(env);

    expect(result).toBe(true);
  });

  it('on web with clipboard.read and permission prompt, returns true', () => {
    const env = { platform: 'web', clipboard: { read }, permission: 'prompt' };

    const result = canReadClipboardFiles(env);

    expect(result).toBe(true);
  });

  it('on web with permission denied, returns false', () => {
    const env = { platform: 'web', clipboard: { read }, permission: 'denied' };

    const result = canReadClipboardFiles(env);

    expect(result).toBe(false);
  });

  it('on web with only clipboard.readText, returns false', () => {
    const env = { platform: 'web', clipboard: { readText: read } };

    const result = canReadClipboardFiles(env);

    expect(result).toBe(false);
  });

  it('on web with no clipboard, returns false', () => {
    const env = { platform: 'web', clipboard: undefined };

    const result = canReadClipboardFiles(env);

    expect(result).toBe(false);
  });

  it('on native even with clipboard.read, returns false', () => {
    const env = { platform: 'ios', clipboard: { read } };

    const result = canReadClipboardFiles(env);

    expect(result).toBe(false);
  });
});
