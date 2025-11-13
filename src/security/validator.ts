// Field name validation with whitelist

// Whitelist of allowed field names for STAC collections
const ALLOWED_FIELDS = new Set([
    'id', 'title', 'description', 'keywords', 'license', 'version',
    'url', 'type', 'stac_version', 'stac_extensions',
    'properties.category', 'properties.type', 'properties.mission',
    'active', 'visible', 'published',
    'price', 'temperature', 'latitude', 'longitude',
    'created', 'updated', 'start_datetime', 'end_datetime'
]);

/**
 * Normalize bracket notation to dot notation
 * properties['type'] -> properties.type
 */
export function normalizeFieldName(fieldName: string): string {
    return fieldName
        .replace(/\['([^']+)'\]/g, '.$1')
        .replace(/\["([^"]+)"\]/g, '.$1')
        .replace(/\[(\w+)\]/g, '.$1');
}

/**
 * Validate field name against whitelist
 * Throws error if field is not allowed
 */
export function validateFieldName(fieldName: string): void {
    const normalized = normalizeFieldName(fieldName);
    
    if (!ALLOWED_FIELDS.has(normalized)) {
        throw new Error(`Invalid field name: ${fieldName}. Field not in whitelist.`);
    }
}

/**
 * Escape SQL identifier (field name) for PostgreSQL
 * Wraps in double quotes and escapes existing quotes
 */
export function escapeIdentifier(fieldName: string): string {
    const normalized = normalizeFieldName(fieldName);
    validateFieldName(fieldName);
    
    // PostgreSQL: wrap identifier in double quotes
    return `"${normalized.replace(/"/g, '""')}"`;
}

/**
 * Add a custom field to the whitelist (for extensibility)
 */
export function allowField(fieldName: string): void {
    ALLOWED_FIELDS.add(fieldName);
}

/**
 * Get all allowed fields
 */
export function getAllowedFields(): string[] {
    return Array.from(ALLOWED_FIELDS);
}
