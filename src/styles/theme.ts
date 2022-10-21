import { extendTheme } from 'native-base';
import { color } from 'native-base/lib/typescript/theme/styled-system';

export const THEME = extendTheme({
  fonts: {
    heading: 'Roboto_700Bold',
    body: 'Roboto_400Regular',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
  },
  color: {
    primary: "#F5A648",
    primary_800: "#BF6D0B",
    primary_200: "#FCECDA"
  }
});