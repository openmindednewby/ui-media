import type React from 'react';

import type { FramingAction } from '../framing/FramingAction';
import type { PhotoFraming, PhotoFramingInput, PhotoFramingTransform } from '../framing/photoFraming';
import type { PhotoFramingSteps } from '../framing/stepFraming';

/** Name + hint of one control. `label` is the full phrase ("Move photo up"). */
export interface FramingActionLabel {
  label: string;
  hint: string;
}

/** Every string the editor shows. The package has no copy of its own (FM-free). */
export interface PhotoFramingLabels {
  /** Heading over the zoom stepper: "Size". */
  size: string;
  /** Heading over the d-pad: "Position". */
  position: string;
  /** Readout between the zoom buttons, given a whole percent: (120) => "120%". */
  scaleValue: (percent: number) => string;
  actions: Record<FramingAction, FramingActionLabel>;
}

export interface PhotoFramingPreviewArgs {
  /** The clamped value. */
  framing: PhotoFraming;
  /** Ready to spread onto the photo: `style={{ transform }}`. */
  transform: PhotoFramingTransform;
}

export interface PhotoFramingEditorProps {
  /** Stored framing; clamped before use, so raw config is safe to pass. */
  value: PhotoFramingInput | null | undefined;
  /** Receives the next clamped value after each press. */
  onChange: (next: PhotoFraming) => void;
  /** Renders the consumer's own card with the photo transformed — a live preview. */
  renderPreview: (args: PhotoFramingPreviewArgs) => React.ReactNode;
  labels: PhotoFramingLabels;
  testID: string;
  steps?: PhotoFramingSteps;
  /** Override the default arrow / plus / minus glyphs (e.g. with ui-icons). */
  renderGlyph?: (action: FramingAction, color: string, size: number) => React.ReactNode;
  disabled?: boolean;
}
