import { useCallback, useMemo, useRef } from 'react';

import { PanResponder } from 'react-native';
import type { GestureResponderHandlers, LayoutChangeEvent } from 'react-native';

import type { PhotoFraming } from '../framing/photoFraming';
import { panFraming } from '../framing/panFraming';

export interface PreviewDrag {
  handlers: GestureResponderHandlers | undefined;
  onLayout: (event: LayoutChangeEvent) => void;
}

/** Mouse / touch drag on the preview pans the photo; off unless `enabled`. */
export function usePreviewDrag(framing: PhotoFraming, onChange: (next: PhotoFraming) => void, enabled: boolean): PreviewDrag {
  const box = useRef({ width: 0, height: 0 });
  const latest = useRef({ framing, onChange });
  latest.current = { framing, onChange };
  const start = useRef(framing);

  const onLayout = useCallback((event: LayoutChangeEvent): void => {
    const { width, height } = event.nativeEvent.layout;
    box.current = { width, height };
  }, []);

  const handlers = useMemo(() => {
    if (!enabled) return undefined;
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        start.current = latest.current.framing;
      },
      onPanResponderMove: (_event, gesture) => {
        latest.current.onChange(panFraming(start.current, { dx: gesture.dx, dy: gesture.dy }, box.current));
      },
    }).panHandlers;
  }, [enabled]);

  return { handlers, onLayout };
}
