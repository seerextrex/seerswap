/**
 * Standard color palette for outcome visualizations
 * Used consistently across all prediction market UI components
 */
export const OUTCOME_COLORS = [
  '#4CAF50', // Green - Often used for "Yes" or positive outcomes
  '#F44336', // Red - Often used for "No" or negative outcomes  
  '#2196F3', // Blue - Third outcome option
  '#FF9800', // Orange - Fourth outcome option
  '#9C27B0', // Purple - Fifth outcome option
  '#00BCD4', // Cyan - Sixth outcome option
] as const;

export type OutcomeColor = typeof OUTCOME_COLORS[number];