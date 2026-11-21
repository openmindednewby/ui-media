import { useEffect, useState } from 'react';

import { Platform } from 'react-native';

import { canReadClipboardFiles } from './canReadClipboardFiles';

const CLIPBOARD_READ = { name: 'clipboard-read' } as unknown as PermissionDescriptor;

function currentNavigator(): Navigator | undefined {
  return typeof navigator === 'undefined' ? undefined : navigator;
}

/** True while this browser can read a file from the clipboard; updates when the clipboard-read permission answers or changes. */
export function useCanPasteFiles(): boolean {
  const [permission, setPermission] = useState<string | undefined>(undefined);
  const nav = currentNavigator();
  const canPaste = canReadClipboardFiles({ platform: Platform.OS, clipboard: nav?.clipboard, permission });
  const supported = canReadClipboardFiles({ platform: Platform.OS, clipboard: nav?.clipboard });

  useEffect(() => {
    const permissions = currentNavigator()?.permissions;
    if (!supported || typeof permissions?.query !== 'function') return undefined;
    let status: PermissionStatus | null = null;
    let live = true;
    const sync = (): void => {
      if (live && status !== null) setPermission(status.state);
    };
    permissions.query(CLIPBOARD_READ).then((answer) => {
      status = answer;
      status.addEventListener('change', sync);
      sync();
    }).catch(() => undefined);
    return () => {
      live = false;
      status?.removeEventListener('change', sync);
    };
  }, [supported]);

  return canPaste;
}
