export function parseCQL2(text: string): { sql: string; values: any[] } {
    // Match field='value' or field="value" (string with quotes)
    let match = text.match(/(\w+(?:\.\w+|\[['"]?\w+['"]?\])*)\s*=\s*(['"])(.*?)\2/i);
    if (match) {
        const fieldName = match[1];
        const fieldValue = match[3];
        return {
            sql: `WHERE ${fieldName} = $1`,
            values: [fieldValue]
        };
    }
    
    // Match field=true or field=false (boolean)
    match = text.match(/(\w+(?:\.\w+|\[['"]?\w+['"]?\])*)\s*=\s*(true|false)/i);
    if (match) {
        const fieldName = match[1];
        const fieldValue = match[2].toLowerCase() === 'true';
        return {
            sql: `WHERE ${fieldName} = $1`,
            values: [fieldValue]
        };
    }
    
    // Match field=null
    match = text.match(/(\w+(?:\.\w+|\[['"]?\w+['"]?\])*)\s*=\s*null/i);
    if (match) {
        const fieldName = match[1];
        return {
            sql: `WHERE ${fieldName} IS NULL`,
            values: []
        };
    }
    
    // Match field=number (integer, decimal, negative)
    match = text.match(/(\w+(?:\.\w+|\[['"]?\w+['"]?\])*)\s*=\s*(-?\d+(?:\.\d+)?)/i);
    if (match) {
        const fieldName = match[1];
        const fieldValue = Number(match[2]);
        return {
            sql: `WHERE ${fieldName} = $1`,
            values: [fieldValue]
        };
    }
    
    // Match field=value (other unquoted values)
    match = text.match(/(\w+(?:\.\w+|\[['"]?\w+['"]?\])*)\s*=\s*(\w+)/i);
    if (match) {
        const fieldName = match[1];
        const fieldValue = match[2];
        return {
            sql: `WHERE ${fieldName} = $1`,
            values: [fieldValue]
        };
    }
    
    return { sql: '', values: [] };
}