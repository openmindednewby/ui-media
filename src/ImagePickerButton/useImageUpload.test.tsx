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

describe('useImageUpload onUploaded', () => {
  it('passes the upload result to onUploaded once done', async () => {
    const onUploaded = jest.fn();
    const { result } = renderHook(() =>
      useImageUpload({ upload: async () => 'https://cdn/a.png', pickFile: async () => 'f', onUploaded }),
    );
    await act(async () => {
      await result.current.pick();
    });
    expect(result.current.status).toBe(ImagePickerStatus.Done);
    expect(onUploaded).toHaveBeenCalledWith('https://cdn/a.png');
  });

  it('does not call onUploaded when upload rejects or the pick is cancelled', async () => {
    const onUploaded = jest.fn();
    const failing = renderHook(() =>
      useImageUpload({ upload: () => Promise.reject(new Error('x')), pickFile: async () => 'f', onUploaded }),
    );
    const cancelled = renderHook(() => useImageUpload({ upload: async () => 1, pickFile: async () => null, onUploaded }));
    await act(async () => {
      await failing.result.current.pick();
      await cancelled.result.current.pick();
    });
    expect(onUploaded).not.toHaveBeenCalled();
  });

  it('keeps the slot done when onUploaded throws', async () => {
    const onError = jest.fn();
    const onUploaded = jest.fn(() => {
      throw new Error('consumer bug');
    });
    const { result } = renderHook(() =>
      useImageUpload({ upload: async () => 'u', pickFile: async () => 'f', onUploaded, onError }),
    );
    await act(async () => {
      await expect(result.current.pick()).rejects.toThrow('consumer bug');
    });
    expect(result.current.status).toBe(ImagePickerStatus.Done);
    expect(onError).not.toHaveBeenCalled();
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

describe('useImageUpload onStatusChange', () => {
  it('reports uploading then done, so a parent can gate its Save', async () => {
    const gate = deferred();
    const onStatusChange = jest.fn();
    const { result } = renderHook(() =>
      useImageUpload({ upload: () => gate.promise, pickFile: async () => 'f', onStatusChange }),
    );
    expect(onStatusChange).not.toHaveBeenCalled();

    let run: Promise<void> = Promise.resolve();
    await act(async () => {
      run = result.current.pick();
    });
    expect(onStatusChange).toHaveBeenLastCalledWith(ImagePickerStatus.Uploading);

    await act(async () => {
      gate.resolve();
      await run;
    });
    expect(onStatusChange.mock.calls).toEqual([[ImagePickerStatus.Uploading], [ImagePickerStatus.Done]]);
  });

  it('reports error when the upload rejects', async () => {
    const onStatusChange = jest.fn();
    const { result } = renderHook(() =>
      useImageUpload({ upload: () => Promise.reject(new Error('x')), pickFile: async () => 'f', onStatusChange }),
    );
    await act(async () => {
      await result.current.pick();
    });
    expect(onStatusChange).toHaveBeenLastCalledWith(ImagePickerStatus.Error);
  });

  it('reports nothing when the pick is cancelled', async () => {
    const onStatusChange = jest.fn();
    const { result } = renderHook(() =>
      useImageUpload({ upload: jest.fn(), pickFile: async () => null, onStatusChange }),
    );
    await act(async () => {
      await result.current.pick();
    });
    expect(onStatusChange).not.toHaveBeenCalled();
  });
});
