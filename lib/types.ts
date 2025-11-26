/**
 * Shared type definitions for Fox Adventures
 */

export interface SearchFilters {
  packageId?: string;
  destination?: string;
  dateRange?: {
    from: Date;
    to?: Date;
  };
  travelers?: number;
}

export type DifficultyLevel = 'EASY' | 'MODERATE' | 'CHALLENGING';
