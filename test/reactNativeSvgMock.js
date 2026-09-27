/**
 * react-native-svg ships untranspiled TS/Flow sources that Jest (jsdom) cannot load.
 * It is only reached transitively (ui-layout -> ui-icons); no suite here renders an icon.
 */
const Noop = () => null;
module.exports = new Proxy({ __esModule: true, default: Noop }, { get: (t, k) => (k in t ? t[k] : Noop) });
