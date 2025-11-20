import { ComparisonNode } from '../types/ast';
/**
 * Parse comparison operators
 * Supports: =, !=, <, >, <=, >=, LIKE, IN, BETWEEN
 */
export declare function parseComparison(input: string): ComparisonNode | null;
/**
 * Check if input contains a comparison operator
 */
export declare function isComparison(input: string): boolean;
//# sourceMappingURL=comparison.d.ts.map