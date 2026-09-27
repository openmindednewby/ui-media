/**
 * AnchoredPhoto — a contained photo that fills its parent box, framed by a
 * `{x, y, scale}` value and anchored to the centre or the bottom edge.
 *
 * Why not `object-position`: RN-web's Image paints a centred background image,
 * so `center bottom` has no effect. Instead the image is sized to its own aspect
 * ratio (measured with `Image.getSize`) and pushed down by flexbox. The framing
 * transform sits on a full-box layer, so its percentages mean the same as the
 * CSS `translate(x%, y%) scale(s)` a static page applies to its `<img>`.
 *
 * The parent owns the box (aspect, radius, background, empty state); this renders
 * only the photo layer. No strings of its own: `accessibilityLabel` is a prop.
 */
import React from 'react';

import { Image, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { clampFraming, framingToTransform } from '../framing/photoFraming';
import type { PhotoFramingInput } from '../framing/photoFraming';
import { PhotoAnchor } from '../PhotoFramingEditor/PhotoAnchor';
import { resolveAnchoredPhotoLayout } from './resolveAnchoredPhotoLayout';
import { useImageAspectRatio } from './useImageAspectRatio';

export interface AnchoredPhotoProps {
  uri: string;
  /** `bottom` for cut-out portraits. Default `center`. */
  anchor?: PhotoAnchor;
  /** Stored or live framing; clamped before use, so raw config is safe. */
  framing?: PhotoFramingInput | null;
  /** Extra style for the full-box frame layer. */
  style?: StyleProp<ViewStyle>;
  accessibilityLabel: string;
  testID?: string;
}

const styles = StyleSheet.create({
  frame: { ...StyleSheet.absoluteFillObject, alignItems: 'center' },
  fill: { height: '100%', width: '100%' },
  sized: { maxHeight: '100%', width: '100%' },
});

export const AnchoredPhoto = ({
  uri,
  anchor = PhotoAnchor.Center,
  framing,
  style,
  accessibilityLabel,
  testID,
}: AnchoredPhotoProps): React.ReactElement => {
  const layout = resolveAnchoredPhotoLayout(anchor, useImageAspectRatio(uri));
  const transform = framingToTransform(clampFraming(framing));
  const imageStyle = layout.aspectRatio === null
    ? styles.fill
    : [styles.sized, { aspectRatio: layout.aspectRatio }];

  return (
    <View style={[styles.frame, { justifyContent: layout.justifyContent, transform }, style]} testID={testID}>
      <Image
        accessibilityLabel={accessibilityLabel}
        resizeMode="contain"
        source={{ uri }}
        style={imageStyle}
      />
    </View>
  );
};
