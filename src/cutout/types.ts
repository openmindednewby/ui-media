export interface CutoutMask {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export interface CutoutCut {
  mask: CutoutMask;
  image: Uint8ClampedArray;
  elapsedMs: number;
}

export interface CutoutBrushOptions {
  mask: CutoutMask;
  image: Uint8ClampedArray;
  getMode: () => string;
  getRadius: () => number;
}

/** The background-removal calls the dialog makes: a remover plus its refine brush and encoder. */
export interface CutoutEngine {
  removeBackground(image: Blob): Promise<CutoutCut>;
  attachRefineBrush(canvas: HTMLCanvasElement, options: CutoutBrushOptions): () => void;
  encodeCutout(image: Uint8ClampedArray, mask: CutoutMask): Promise<Blob>;
}

export interface CutoutControlLabel {
  label: string;
  hint: string;
}

/** Every string the Compare dialog shows. The package has no copy of its own. */
export interface CutoutLabels {
  title: string;
  cutting: string;
  summary: (seconds: string) => string;
  failed: string;
  original: string;
  cutout: string;
  brush: string;
  zoom: string;
  zoomValue: (percent: number) => string;
  brushSize: string;
  keep: CutoutControlLabel;
  erase: CutoutControlLabel;
  move: CutoutControlLabel;
  zoomIn: CutoutControlLabel;
  zoomOut: CutoutControlLabel;
  brushSizeControl: CutoutControlLabel;
  split: CutoutControlLabel;
  use: CutoutControlLabel;
  cancel: CutoutControlLabel;
}
