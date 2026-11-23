import React from 'react';

import { Pressable, StyleSheet, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { PdfPageImage } from './PdfPageImage';
import { thumbnailKind, ThumbnailKind } from './ThumbnailKind';
import { useBytesUrl } from './useBytesUrl';

import type { PdfPages } from './pdfPages';

const BORDER = 1;
const RADIUS = 6;
const IMAGE_STYLE = { display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' } as const;

const styles = StyleSheet.create({
  box: { borderWidth: BORDER, borderRadius: RADIUS, overflow: 'hidden', flexShrink: 0 },
  fill: { flex: 1 },
});

export interface ProofThumbnailProps {
  bytes: Uint8Array | null;
  mimeType: string;
  pages: PdfPages;
  width: number;
  height: number;
  label: string;
  hint: string;
  testID: string;
  onPress: () => void;
}

/** A pressable first look at a file, clipped to a fixed box: a PDF's first page or the image itself; blank while bytes are missing. */
export const ProofThumbnail = ({ bytes, mimeType, pages, width, height, label, hint, testID, onPress }: ProofThumbnailProps): React.ReactElement => {
  const { colors } = useUi().theme;
  const kind = thumbnailKind(mimeType);
  const url = useBytesUrl(kind === ThumbnailKind.Image ? bytes : null, mimeType);
  const blank = <View style={styles.fill} testID={`${testID}-blank`} />;
  const showPdf = kind === ThumbnailKind.Pdf && bytes !== null;
  const showImage = kind === ThumbnailKind.Image && url !== null;
  return (
    <Pressable
      accessibilityHint={hint}
      accessibilityLabel={label}
      accessibilityRole="button"
      style={[styles.box, { width, height, borderColor: colors.border, backgroundColor: colors.surface }]}
      testID={testID}
      onPress={onPress}
    >
      {showPdf ? (
        <PdfPageImage borderColor={colors.surface} bytes={bytes} failure={blank} fallback={blank} label={label} pages={pages} testID={`${testID}-page`} width={width - 2 * BORDER} />
      ) : null}
      {showImage ? <img alt={label} data-testid={`${testID}-image`} src={url} style={IMAGE_STYLE} /> : null}
      {showPdf || showImage ? null : blank}
    </Pressable>
  );
};
