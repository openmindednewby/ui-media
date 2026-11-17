import createQrCode from 'qrcode-generator';

const ERROR_CORRECTION_LEVEL = 'M';
const AUTO_TYPE_NUMBER = 0;
const QUIET_ZONE_MODULES = 4;

/** One SVG path covering every dark module, and the side of its square viewBox. */
export interface QrGeometry {
  path: string;
  size: number;
}

function darkRows(text: string): boolean[][] {
  const qr = createQrCode(AUTO_TYPE_NUMBER, ERROR_CORRECTION_LEVEL);
  qr.addData(text);
  qr.make();
  const count = qr.getModuleCount();
  return Array.from({ length: count }, (_row, row) => Array.from({ length: count }, (_col, col) => qr.isDark(row, col)));
}

function runPath(row: number, start: number, end: number): string {
  const width = end - start;
  return `M${String(start + QUIET_ZONE_MODULES)} ${String(row + QUIET_ZONE_MODULES)}h${String(width)}v1h-${String(width)}z`;
}

function rowRuns(cells: readonly boolean[], row: number): string[] {
  const parts: string[] = [];
  let runStart = -1;
  cells.forEach((dark, col) => {
    if (dark && runStart < 0) runStart = col;
    if (!dark && runStart >= 0) {
      parts.push(runPath(row, runStart, col));
      runStart = -1;
    }
  });
  if (runStart >= 0) parts.push(runPath(row, runStart, cells.length));
  return parts;
}

/** Builds the QR symbol of a text as one SVG path; an empty text gives an empty path. */
export function buildQrGeometry(text: string): QrGeometry {
  if (text.length === 0) return { path: '', size: 0 };
  const rows = darkRows(text);
  return { path: rows.flatMap((cells, row) => rowRuns(cells, row)).join(''), size: rows.length + QUIET_ZONE_MODULES * 2 };
}
