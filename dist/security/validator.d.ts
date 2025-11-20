/**
 * Normalize bracket notation to dot notation
 * properties['type'] -> properties.type
 */
export declare function normalizeFieldName(fieldName: string): string;
/**
 * Validate field name against whitelist
 * Throws error if field is not allowed
 */
export declare function validateFieldName(fieldName: string): void;
/**
 * Escape SQL identifier (field name) for PostgreSQL
 * Wraps in double quotes and escapes existing quotes
 */
export declare function escapeIdentifier(fieldName: string): string;
/**
 * Add a custom field to the whitelist (for extensibility)
 */
export declare function allowField(fieldName: string): void;
/**
 * Get all allowed fields
 */
export declare function getAllowedFields(): string[];
//# sourceMappingURL=validator.d.ts.map