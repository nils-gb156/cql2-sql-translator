"use strict";
// Field name validation with whitelist
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeFieldName = normalizeFieldName;
exports.validateFieldName = validateFieldName;
exports.escapeIdentifier = escapeIdentifier;
exports.allowField = allowField;
exports.getAllowedFields = getAllowedFields;
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
function normalizeFieldName(fieldName) {
    return fieldName
        .replace(/\['([^']+)'\]/g, '.$1')
        .replace(/\["([^"]+)"\]/g, '.$1')
        .replace(/\[(\w+)\]/g, '.$1');
}
/**
 * Validate field name against whitelist
 * Throws error if field is not allowed
 */
function validateFieldName(fieldName) {
    const normalized = normalizeFieldName(fieldName);
    if (!ALLOWED_FIELDS.has(normalized)) {
        throw new Error(`Invalid field name: ${fieldName}. Field not in whitelist.`);
    }
}
/**
 * Escape SQL identifier (field name) for PostgreSQL
 * Wraps in double quotes and escapes existing quotes
 */
function escapeIdentifier(fieldName) {
    const normalized = normalizeFieldName(fieldName);
    validateFieldName(fieldName);
    // PostgreSQL: wrap identifier in double quotes
    return `"${normalized.replace(/"/g, '""')}"`;
}
/**
 * Add a custom field to the whitelist (for extensibility)
 */
function allowField(fieldName) {
    ALLOWED_FIELDS.add(fieldName);
}
/**
 * Get all allowed fields
 */
function getAllowedFields() {
    return Array.from(ALLOWED_FIELDS);
}
//# sourceMappingURL=validator.js.map