/**
 * Premium color palette for outcome visualizations
 * Carefully selected for harmony, accessibility, and visual appeal
 * Used consistently across all prediction market UI components
 */
export const OUTCOME_COLORS = [
  '#10B981', // Emerald - Success/Yes/Positive (softer, more sophisticated green)
  '#F59E0B', // Amber - Warning/Maybe/Neutral (warm, attention-grabbing)
  '#EF4444', // Rose Red - Danger/No/Negative (vibrant but not harsh)
  '#8B5CF6', // Violet - Alternative option (royal purple)
  '#3B82F6', // Blue - Information/Neutral (trustworthy blue)
  '#EC4899', // Pink - Creative option (modern pink)
  '#14B8A6', // Teal - Balanced option (calming teal)
  '#6366F1', // Indigo - Premium option (deep indigo)
] as const;

/**
 * Gradient pairs for each outcome color
 * Used for more sophisticated visual effects
 */
export const OUTCOME_GRADIENTS = [
  ['#10B981', '#059669'], // Emerald gradient
  ['#F59E0B', '#D97706'], // Amber gradient
  ['#EF4444', '#DC2626'], // Rose gradient
  ['#8B5CF6', '#7C3AED'], // Violet gradient
  ['#3B82F6', '#2563EB'], // Blue gradient
  ['#EC4899', '#DB2777'], // Pink gradient
  ['#14B8A6', '#0D9488'], // Teal gradient
  ['#6366F1', '#4F46E5'], // Indigo gradient
] as const;

export type OutcomeColor = typeof OUTCOME_COLORS[number];