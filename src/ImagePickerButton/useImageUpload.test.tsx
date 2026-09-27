import { act, renderHook } from '@testing-library/react';

import { resolvePickerView } from './ImagePickerButton';
import { ImagePickerStatus } from './ImagePickerStatus';
import { useImageUpload } from './useImageUpload';

const LABELS = {
  pick: 'pick',
  uploading: 'uploading',
  replace: 'replace',
  retry: 'retry',
  done: 'done',
  error: 'error',
  hint: 'hint',
};

const deferred = (): { promise: Promise<void>; resolve: () => void; reject: (e: unknown) => void } => {
  let resolve = (): void => undefined;
  let reject = (_e: unknown): void => undefined;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe('useImageUpload', () => {
  it('goes idle -> uploading -> done and hands the picked file to upload', async () => {
    const gate = deferred();
    const upload = jest.fn(() => gate.promise);
    const { result } = renderHook(() => useImageUpload({ upload, pickFile: async () => 'file-a' }));
    expect(result.current.status).toBe(ImagePickerStatus.Idle);

    let run: Promise<void> = Promise.resolve();
    await act(async () => {
      run = result.current.pick();
    });
    expect(result.current.status).toBe(ImagePickerStatus.Uploading);
    expect(upload).toHaveBeenCalledWith('file-a');

    await act(async () => {
      gate.resolve();
      await run;
    });
    expect(result.current.status).toBe(ImagePickerStatus.Done);
  });

  it('lands in error and reports it when upload rejects', async () => {
    const onError = jest.fn();
    const failure = new Error('boom');
    const { result } = renderHook(() =>
      useImageUpload({ upload: () => Promise.reject(failure), pickFile: async () => 'f', onError }),
    );
    await act(async () => {
      await result.current.pick();
    });
    expect(result.current.status).toBe(ImagePickerStatus.Error);
    expect(onError).toHaveBeenCalledWith(failure);
  });

  it('keeps the current state when the pick is cancelled', async () => {
    const upload = jest.fn(() => Promise.resolve());
    const { result } = renderHook(() => useImageUpload({ upload, pickFile: async () => null, hasImage: true }));
    await act(async () => {
      await result.current.pick();
    });
    expect(result.current.status).toBe(ImagePickerStatus.Done);
    expect(upload).not.toHaveBeenCalled();
  });

  it('ignores a second pick while one is in flight', async () => {
    const gate = deferred();
    const upload = jest.fn(() => gate.promise);
    const pickFile = jest.fn(async () => 'f');
    const { result } = renderHook(() => useImageUpload({ upload, pickFile }));
    await act(async () => {
      void result.current.pick();
      await result.current.pick();
    });
    expect(pickFile).toHaveBeenCalledTimes(1);
    await act(async () => gate.resolve());
  });
});

describe('resolvePickerView', () => {
  it('maps each status to its button label and status line', () => {
    expect(resolvePickerView(ImagePickerStatus.Idle, LABELS)).toMatchObject({ buttonLabel: 'pick', statusText: null });
    expect(resolvePickerView(ImagePickerStatus.Uploading, LABELS)).toMatchObject({ buttonLabel: 'uploading' });
    expect(resolvePickerView(ImagePickerStatus.Error, LABELS)).toMatchObject({
      buttonLabel: 'retry',
      statusText: 'error',
      variant: 'danger',
    });
    expect(resolvePickerView(ImagePickerStatus.Done, LABELS)).toMatchObject({ buttonLabel: 'replace', statusText: 'done' });
  });
});
