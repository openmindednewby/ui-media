import React from 'react';

import { StyleSheet, View } from 'react-native';

const BOX = 24;
const STROKE = 2;
const TRAY_INSET = 4;
const TRAY_BOTTOM = 3;
const TRAY_HEIGHT = 6;
const SHAFT_LEFT = 11;
const SHAFT_TOP = 4;
const SHAFT_HEIGHT = 12;
const HEAD = 10;
const HEAD_LEFT = 7;
const HEAD_TOP = 5;

const styles = StyleSheet.create({
  box: { width: BOX, height: BOX, flexShrink: 0 },
  tray: { position: 'absolute', left: TRAY_INSET, right: TRAY_INSET, bottom: TRAY_BOTTOM, height: TRAY_HEIGHT, borderWidth: STROKE, borderTopWidth: 0 },
  shaft: { position: 'absolute', left: SHAFT_LEFT, top: SHAFT_TOP, width: STROKE, height: SHAFT_HEIGHT },
  head: { position: 'absolute', left: HEAD_LEFT, top: HEAD_TOP, width: HEAD, height: HEAD, borderTopWidth: STROKE, borderLeftWidth: STROKE, transform: [{ rotate: '45deg' }] },
});

export interface UploadGlyphProps {
  color: string;
  testID: string;
}

/** A 24 px upload mark (arrow up out of a tray) drawn with views, hidden from screen readers. */
export const UploadGlyph = ({ color, testID }: UploadGlyphProps): React.ReactElement => (
  <View accessibilityElementsHidden aria-hidden importantForAccessibility="no-hide-descendants" style={styles.box} testID={testID}>
    <View style={[styles.tray, { borderColor: color }]} />
    <View style={[styles.shaft, { backgroundColor: color }]} />
    <View style={[styles.head, { borderColor: color }]} />
  </View>
);

export default UploadGlyph;
