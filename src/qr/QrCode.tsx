import React, { useMemo } from 'react';

import { View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { buildQrGeometry } from './qrGeometry';

/** Props of {@link QrCode}; colours come from the host theme, the label names what the code opens. */
export interface QrCodeProps {
  value: string;
  size: number;
  color: string;
  background: string;
  accessibilityLabel: string;
  testID?: string;
}

/** Draws the QR symbol of `value` as one SVG path; an empty value draws nothing. */
export const QrCode = ({ value, size, color, background, accessibilityLabel, testID }: QrCodeProps): React.ReactElement | null => {
  const geometry = useMemo(() => buildQrGeometry(value), [value]);
  if (geometry.size === 0) return null;
  const side = String(geometry.size);
  return (
    <View accessible accessibilityLabel={accessibilityLabel} accessibilityRole="image" style={{ width: size, height: size }} testID={testID}>
      <Svg height={size} viewBox={`0 0 ${side} ${side}`} width={size}>
        <Rect fill={background} height={geometry.size} width={geometry.size} />
        <Path d={geometry.path} fill={color} />
      </Svg>
    </View>
  );
};
