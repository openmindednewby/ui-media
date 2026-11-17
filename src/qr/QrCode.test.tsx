import { render, screen } from '@testing-library/react';

import { ON_BRAND_DARK_INK, ON_BRAND_LIGHT_INK } from '@dloizides/design-tokens';

import { QrCode } from './QrCode';

jest.mock('react-native-svg', () => {
  const ReactModule = require('react') as typeof import('react');
  interface StubProps { fill?: string; children?: React.ReactNode }
  const Svg = ({ children }: StubProps) => ReactModule.createElement('svg', null, children);
  const Rect = ({ fill }: StubProps) => ReactModule.createElement('rect', { 'data-testid': 'qr-ground', 'data-fill': fill });
  const Path = ({ fill }: StubProps) => ReactModule.createElement('path', { 'data-testid': 'qr-modules', 'data-fill': fill });
  return { __esModule: true, default: Svg, Rect, Path };
});

jest.mock('react-native', () => {
  const ReactModule = require('react') as typeof import('react');
  interface StubViewProps { testID?: string; accessibilityLabel?: string; accessibilityHint?: string; children?: React.ReactNode }
  const View = ({ testID, accessibilityLabel, accessibilityHint, children }: StubViewProps) =>
    ReactModule.createElement('div', { 'data-testid': testID, 'data-label': accessibilityLabel, 'data-hint': accessibilityHint }, children);
  return { View };
});

describe('QrCode', () => {
  it('with dark-theme colours passed, still draws dark modules on a light ground', () => {
    const darkThemeInk = '#f5f5f5';
    const darkThemeGround = '#101010';

    render(<QrCode accessibilityLabel="Scan to verify" background={darkThemeGround} color={darkThemeInk} size={160} value="https://verify.example.test/s/abc" />);

    expect([screen.getByTestId('qr-modules').getAttribute('data-fill'), screen.getByTestId('qr-ground').getAttribute('data-fill')]).toEqual([ON_BRAND_DARK_INK, ON_BRAND_LIGHT_INK]);
  });

  it('with an accessibility hint, exposes it with the label on the image', () => {
    const hint = 'Opens the verification on your phone';

    render(<QrCode accessibilityHint={hint} accessibilityLabel="Scan to verify" size={160} testID="qr" value="https://verify.example.test/s/abc" />);

    const image = screen.getByTestId('qr');

    expect([image.getAttribute('data-label'), image.getAttribute('data-hint')]).toEqual(['Scan to verify', hint]);
  });

  it('with an empty value, draws nothing', () => {
    render(<QrCode accessibilityLabel="Scan to verify" size={160} testID="qr" value="" />);

    const image = screen.queryByTestId('qr');

    expect(image).toBeNull();
  });
});
