/**
 * Shared type definitions for Oliotya Uganda Safaris
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
