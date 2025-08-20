import { Theme } from '../types';
import { COLORS, BREAKPOINTS, SPACING } from '../constants';

const theme: Theme = {
  colors: {
    primary: COLORS.PRIMARY,
    secondary: COLORS.SECONDARY,
    success: COLORS.SUCCESS,
    warning: COLORS.WARNING,
    error: COLORS.ERROR,
    info: COLORS.INFO,
    background: COLORS.BACKGROUND,
    surface: COLORS.SURFACE,
    border: COLORS.BORDER,
    text: {
      primary: COLORS.TEXT_PRIMARY,
      secondary: COLORS.TEXT_SECONDARY,
      disabled: COLORS.TEXT_DISABLED,
    },
  },
  spacing: {
    xs: SPACING.XS,
    sm: SPACING.SM,
    md: SPACING.MD,
    lg: SPACING.LG,
    xl: SPACING.XL,
  },
  breakpoints: {
    mobile: BREAKPOINTS.MOBILE,
    tablet: BREAKPOINTS.TABLET,
    desktop: BREAKPOINTS.DESKTOP,
  },
};

export default theme;