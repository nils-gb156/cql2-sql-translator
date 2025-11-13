// Whitelist of allowed field names for STAC collections
const ALLOWED_FIELDS = new Set([
    'id', 'title', 'description', 'keywords', 'license', 'version',
    'url', 'type', 'stac_version', 'stac_extensions',
    'properties.category', 'properties.type', 'properties.mission',
    'active', 'visible', 'published',
    'price', 'temperature', 'latitude', 'longitude'
]);

function escapeIdentifier(identifier: string): string {
    // Normalize bracket notation to dot notation: properties['type'] -> properties.type
    let cleaned = identifier.replace(/\['([^']+)'\]/g, '.$1')
                            .replace(/\["([^"]+)"\]/g, '.$1')
                            .replace(/\[(\w+)\]/g, '.$1');
    
    // Validate against whitelist
    if (!ALLOWED_FIELDS.has(cleaned)) {
        throw new Error(`Invalid field name: ${identifier}. Field not in whitelist.`);
    }
    
    // Escape identifier by wrapping in double quotes and escaping existing quotes
    // PostgreSQL standard: identifier names should be quoted if they contain special chars
    return `"${cleaned.replace(/"/g, '""')}"`;
}

export function parseCQL2(text: string): { sql: string; values: any[] } {
    // Trim and validate input
    const trimmed = text.trim();
    
    // Detect suspicious characters that could indicate SQL injection
    if (trimmed.includes(';') || trimmed.includes('--') || trimmed.includes('/*')) {
        throw new Error('Invalid CQL2 syntax: suspicious characters detected');
    }
    
    // Match field!='value' or field="value" (string with quotes) - NOT EQUAL
    let match = text.match(/(\w+(?:\.\w+|\[['"]?\w+['"]?\])*)\s*!=\s*(['"])(.*?)\2/i);
    if (match) {
        const fieldName = escapeIdentifier(match[1]);
        const fieldValue = match[3];
        return {
            sql: `WHERE ${fieldName} != $1`,
            values: [fieldValue]
        };
    }
    
    // Match field='value' or field="value" (string with quotes) - EQUAL
    match = text.match(/(\w+(?:\.\w+|\[['"]?\w+['"]?\])*)\s*=\s*(['"])(.*?)\2/i);
    if (match) {
        const fieldName = escapeIdentifier(match[1]);
        const fieldValue = match[3];
        return {
            sql: `WHERE ${fieldName} = $1`,
            values: [fieldValue]
        };
    }
    
    // Match field!=true or field!=false (boolean) - NOT EQUAL
    match = text.match(/(\w+(?:\.\w+|\[['"]?\w+['"]?\])*)\s*!=\s*(true|false)/i);
    if (match) {
        const fieldName = escapeIdentifier(match[1]);
        const fieldValue = match[2].toLowerCase() === 'true';
        return {
            sql: `WHERE ${fieldName} != $1`,
            values: [fieldValue]
        };
    }
    
    // Match field=true or field=false (boolean) - EQUAL
    match = text.match(/(\w+(?:\.\w+|\[['"]?\w+['"]?\])*)\s*=\s*(true|false)/i);
    if (match) {
        const fieldName = escapeIdentifier(match[1]);
        const fieldValue = match[2].toLowerCase() === 'true';
        return {
            sql: `WHERE ${fieldName} = $1`,
            values: [fieldValue]
        };
    }
    
    // Match field!=null - NOT EQUAL
    match = text.match(/(\w+(?:\.\w+|\[['"]?\w+['"]?\])*)\s*!=\s*null/i);
    if (match) {
        const fieldName = escapeIdentifier(match[1]);
        return {
            sql: `WHERE ${fieldName} IS NOT NULL`,
            values: []
        };
    }
    
    // Match field=null - EQUAL
    match = text.match(/(\w+(?:\.\w+|\[['"]?\w+['"]?\])*)\s*=\s*null/i);
    if (match) {
        const fieldName = escapeIdentifier(match[1]);
        return {
            sql: `WHERE ${fieldName} IS NULL`,
            values: []
        };
    }
    
    // Match field!=number (integer, decimal, negative) - NOT EQUAL
    match = text.match(/(\w+(?:\.\w+|\[['"]?\w+['"]?\])*)\s*!=\s*(-?\d+(?:\.\d+)?)/i);
    if (match) {
        const fieldName = escapeIdentifier(match[1]);
        const fieldValue = Number(match[2]);
        return {
            sql: `WHERE ${fieldName} != $1`,
            values: [fieldValue]
        };
    }
    
    // Match field=number (integer, decimal, negative) - EQUAL
    match = text.match(/(\w+(?:\.\w+|\[['"]?\w+['"]?\])*)\s*=\s*(-?\d+(?:\.\d+)?)/i);
    if (match) {
        const fieldName = escapeIdentifier(match[1]);
        const fieldValue = Number(match[2]);
        return {
            sql: `WHERE ${fieldName} = $1`,
            values: [fieldValue]
        };
    }
    
    // Match field!=value (other unquoted values) - NOT EQUAL
    match = text.match(/(\w+(?:\.\w+|\[['"]?\w+['"]?\])*)\s*!=\s*(\w+)/i);
    if (match) {
        const fieldName = escapeIdentifier(match[1]);
        const fieldValue = match[2];
        return {
            sql: `WHERE ${fieldName} != $1`,
            values: [fieldValue]
        };
    }
    
    // Match field=value (other unquoted values) - EQUAL
    match = text.match(/(\w+(?:\.\w+|\[['"]?\w+['"]?\])*)\s*=\s*(\w+)/i);
    if (match) {
        const fieldName = escapeIdentifier(match[1]);
        const fieldValue = match[2];
        return {
            sql: `WHERE ${fieldName} = $1`,
            values: [fieldValue]
        };
    }
    
    return { sql: '', values: [] };
}