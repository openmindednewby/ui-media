import React, { useMemo } from 'react';

import { View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { ON_BRAND_DARK_INK, ON_BRAND_LIGHT_INK } from '@dloizides/design-tokens';

import { buildQrGeometry } from './qrGeometry';

/** Props of {@link QrCode}; the label names what the code opens, the hint what scanning it does. */
export interface QrCodeProps {
  value: string;
  size: number;
  /** Ignored: modules are always dark so every scanner reads the code, whatever the theme. */
  color?: string;
  /** Ignored: the ground and quiet zone are always light, whatever the theme. */
  background?: string;
  accessibilityLabel: string;
  accessibilityHint?: string;
  testID?: string;
}

/** Draws the QR symbol of `value` as dark modules on a light ground with a quiet zone; an empty value draws nothing. */
export const QrCode = ({ value, size, accessibilityLabel, accessibilityHint, testID }: QrCodeProps): React.ReactElement | null => {
  const geometry = useMemo(() => buildQrGeometry(value), [value]);
  if (geometry.size === 0) return null;
  const side = String(geometry.size);
  return (
    <View accessible accessibilityHint={accessibilityHint} accessibilityLabel={accessibilityLabel} accessibilityRole="image" style={{ width: size, height: size }} testID={testID}>
      <Svg height={size} viewBox={`0 0 ${side} ${side}`} width={size}>
        <Rect fill={ON_BRAND_LIGHT_INK} height={geometry.size} width={geometry.size} />
        <Path d={geometry.path} fill={ON_BRAND_DARK_INK} />
      </Svg>
    </View>
  );
};
