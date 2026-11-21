import { FilePreviewKind } from './FilePreviewKind';

const WILDCARD_SUFFIX = '/*';
const IMAGE_PREFIX = 'image/';

/** The parts of a file the accept check reads. */
export interface FileLike {
  name: string;
  type: string;
}

function matchesEntry(file: FileLike, entry: string): boolean {
  const rule = entry.trim().toLowerCase();
  if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule);
  if (rule.endsWith(WILDCARD_SUFFIX)) return file.type.toLowerCase().startsWith(rule.slice(0, -1));
  return file.type.toLowerCase() === rule;
}

/** True when the file matches one accept entry: a MIME type, a `type/*` wildcard or a `.ext` suffix. */
export function isAcceptedFile(file: FileLike, accept: readonly string[]): boolean {
  return accept.some((entry) => matchesEntry(file, entry));
}

/** The first file of a file list, or null when there is none. */
export function firstFile(files: ArrayLike<File> | null | undefined): File | null {
  if (files === null || files === undefined || files.length === 0) return null;
  return files[0] ?? null;
}

/** Images preview as a picture; every other file as its name. */
export function previewKindOf(mimeType: string): FilePreviewKind {
  return mimeType.toLowerCase().startsWith(IMAGE_PREFIX) ? FilePreviewKind.Image : FilePreviewKind.Document;
}
