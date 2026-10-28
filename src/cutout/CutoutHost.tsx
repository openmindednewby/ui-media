import React, { useEffect, useState } from 'react';

import { CutoutDialog } from './CutoutDialog';
import type { CutoutRequest } from './cutoutRegistry';
import { registerCutoutHost } from './cutoutRegistry';
import type { CutoutEngine, CutoutLabels } from './types';

export interface CutoutHostProps {
  engine: CutoutEngine;
  labels: CutoutLabels;
  testID?: string;
}

/** Mount once inside the app's ui-feedback provider; `openCutout(image)` then shows the Compare dialog here. */
export const CutoutHost = ({ engine, labels, testID }: CutoutHostProps): React.ReactElement | null => {
  const [request, setRequest] = useState<CutoutRequest | null>(null);
  useEffect(() => registerCutoutHost(setRequest), []);
  if (request === null) return null;
  return <CutoutDialog engine={engine} image={request.image} labels={labels} testID={testID} onDone={request.resolve} />;
};
