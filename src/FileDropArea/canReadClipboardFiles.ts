const WEB = 'web';
const DENIED = 'denied';

export interface ClipboardEnv {
  platform: string;
  clipboard: { read?: unknown; readText?: unknown } | undefined;
  permission?: string;
}

/** True when the Paste button can read a file: web, `navigator.clipboard.read` present and the clipboard-read permission not denied. */
export function canReadClipboardFiles(env: ClipboardEnv): boolean {
  if (env.platform !== WEB) return false;
  if (typeof env.clipboard?.read !== 'function') return false;
  return env.permission !== DENIED;
}
