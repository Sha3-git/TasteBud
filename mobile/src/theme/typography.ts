export const typography = {
  sizes: { base: 16, lg: 18, '2xl': 24, '3xl': 30, '5xl': 48 },
  weights: { regular: '400' as const, semibold: '600' as const, bold: '700' as const },
};

export const textStyles = {
  displayMedium: { fontSize: typography.sizes['5xl'], fontWeight: typography.weights.bold },
  h1: { fontSize: typography.sizes['3xl'], fontWeight: typography.weights.bold },
  body: { fontSize: typography.sizes.base, fontWeight: typography.weights.regular },
};
