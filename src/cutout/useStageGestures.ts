import { useMemo, useRef } from 'react';

import { PanResponder } from 'react-native';
import type { GestureResponderHandlers } from 'react-native';

import type { CutoutPoint, CutoutSize } from './cutoutMath';
import { clampPan, splitAt } from './cutoutMath';

export interface StageGestures {
  splitHandlers: GestureResponderHandlers;
  panHandlers: GestureResponderHandlers;
}

interface StageGestureArgs {
  stage: CutoutSize;
  split: number;
  onSplit: (split: number) => void;
  zoom: number;
  pan: CutoutPoint;
  onPan: (pan: CutoutPoint) => void;
}

/** Drag handlers for the split handle and for panning a zoomed stage with the Move tool. */
export function useStageGestures(args: StageGestureArgs): StageGestures {
  const latest = useRef(args);
  latest.current = args;
  const start = useRef({ split: args.split, pan: args.pan });

  return useMemo(() => {
    const split = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        start.current = { ...start.current, split: latest.current.split };
      },
      onPanResponderMove: (_event, gesture) => {
        const { stage, onSplit } = latest.current;
        onSplit(splitAt(start.current.split * stage.width + gesture.dx, stage.width));
      },
    });
    const pan = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        start.current = { ...start.current, pan: latest.current.pan };
      },
      onPanResponderMove: (_event, gesture) => {
        const { stage, zoom, onPan } = latest.current;
        const from = start.current.pan;
        onPan(clampPan({ x: from.x + gesture.dx, y: from.y + gesture.dy }, zoom, stage));
      },
    });
    return { splitHandlers: split.panHandlers, panHandlers: pan.panHandlers };
  }, []);
}
