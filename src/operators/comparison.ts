// Comparison operators: =, !=, <, >, <=, >=, LIKE, IN, BETWEEN

import { ComparisonNode, LiteralNode } from '../types/ast';

/**
 * Parse comparison operators
 * Supports: =, !=, <, >, <=, >=, LIKE, IN, BETWEEN
 */
export function parseComparison(input: string): ComparisonNode | null {
     const trimmed = input.trim();

     // LIKE
     const likeNode = tryParseLike(trimmed);
     if (likeNode) return likeNode;

     // IN
     const inNode = tryParseIn(trimmed);
     if (inNode) return inNode;

     // BETWEEN
     const betweenNode = tryParseBetween(trimmed);
     if (betweenNode) return betweenNode;

     // Standard comparison operators (order matters: check <= before <, >= before >)
     const operators = ['<=', '>=', '!=', '=', '<', '>'] as const;
    
    for (const operator of operators) {
        const result = tryParseOperator(trimmed, operator);
        if (result) {
            return result;
        }
    }
    
    return null;
}

function tryParseOperator(
    input: string,
    operator: '=' | '!=' | '<' | '>' | '<=' | '>='
): ComparisonNode | null {
    // Escape special regex characters in operator
    const escapedOp = operator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Match field operator 'value' (string with quotes)
    let regex = new RegExp(`(\\w+(?:\\.\\w+|\\[['"]?\\w+['"]?\\])*)\\s*${escapedOp}\\s*(['"])(.*?)\\2`, 'i');
    let match = input.match(regex);
    
    if (match) {
        return {
            type: 'comparison',
            operator,
            field: match[1],
            value: {
                type: 'literal',
                dataType: 'string',
                value: match[3]
            }
        };
    }
    
    // Match field operator true/false (boolean)
    regex = new RegExp(`(\\w+(?:\\.\\w+|\\[['"]?\\w+['"]?\\])*)\\s*${escapedOp}\\s*(true|false)`, 'i');
    match = input.match(regex);
    
    if (match) {
        return {
            type: 'comparison',
            operator,
            field: match[1],
            value: {
                type: 'literal',
                dataType: 'boolean',
                value: match[2].toLowerCase() === 'true'
            }
        };
    }
    
    // Match field operator null
    regex = new RegExp(`(\\w+(?:\\.\\w+|\\[['"]?\\w+['"]?\\])*)\\s*${escapedOp}\\s*null`, 'i');
    match = input.match(regex);
    
    if (match) {
        return {
            type: 'comparison',
            operator,
            field: match[1],
            value: {
                type: 'literal',
                dataType: 'null',
                value: null
            }
        };
    }
    
    // Match field operator number (integer, decimal, negative)
    regex = new RegExp(`(\\w+(?:\\.\\w+|\\[['"]?\\w+['"]?\\])*)\\s*${escapedOp}\\s*(-?\\d+(?:\\.\\d+)?)`, 'i');
    match = input.match(regex);
    
    if (match) {
        return {
            type: 'comparison',
            operator,
            field: match[1],
            value: {
                type: 'literal',
                dataType: 'number',
                value: Number(match[2])
            }
        };
    }
    
    return null;
}

// LIKE operator: field LIKE 'pattern'
function tryParseLike(input: string): ComparisonNode | null {
    const regex = /(\w+(?:\.\w+|\[['"]?\w+['"]?\])*)\s+LIKE\s+(['"])(.*?)\2/i;
    const match = input.match(regex);
    if (!match) return null;

    return {
        type: 'comparison',
        operator: 'LIKE',
        field: match[1],
        value: {
            type: 'literal',
            dataType: 'string',
            value: match[3]
        }
    };
}

// IN operator: field IN (1,2,'a',true,null,...)
function tryParseIn(input: string): ComparisonNode | null {
    const regex = /(\w+(?:\.\w+|\[['"]?\w+['"]?\])*)\s+IN\s*\((.*)\)/i;
    const match = input.match(regex);
    if (!match) return null;

    const field = match[1];
    const listContent = match[2].trim();
    if (!listContent) return null;

    const rawItems = splitCommaSeparated(listContent);
    const values: LiteralNode[] = rawItems.map(parseLiteralValue);

    return {
        type: 'comparison',
        operator: 'IN',
        field,
        value: values
    };
}

// BETWEEN operator: field BETWEEN a AND b
function tryParseBetween(input: string): ComparisonNode | null {
    const regex = /(\w+(?:\.\w+|\[['"]?\w+['"]?\])*)\s+BETWEEN\s+(.+?)\s+AND\s+(.+)/i;
    const match = input.match(regex);
    if (!match) return null;

    const field = match[1];
    const leftRaw = match[2].trim();
    const rightRaw = match[3].trim();

    const left = parseLiteralValue(leftRaw);
    const right = parseLiteralValue(rightRaw);

    return {
        type: 'comparison',
        operator: 'BETWEEN',
        field,
        value: [left, right]
    };
}

// Split comma-separated values respecting quotes
function splitCommaSeparated(input: string): string[] {
    const result: string[] = [];
    let current = '';
    let inSingle = false;
    let inDouble = false;

    for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "'" && !inDouble) {
            inSingle = !inSingle;
            current += ch;
        } else if (ch === '"' && !inSingle) {
            inDouble = !inDouble;
            current += ch;
        } else if (ch === ',' && !inSingle && !inDouble) {
            result.push(current.trim());
            current = '';
        } else {
            current += ch;
        }
    }
    if (current.trim()) {
        result.push(current.trim());
    }
    return result;
}

// Parse a single literal value from text (string/number/boolean/null)
function parseLiteralValue(text: string): LiteralNode {
    const trimmed = text.trim();

    // String with quotes
    const strMatch = trimmed.match(/^(['"])(.*)\1$/);
    if (strMatch) {
        return {
            type: 'literal',
            dataType: 'string',
            value: strMatch[2]
        };
    }

    // Boolean
    if (/^(true|false)$/i.test(trimmed)) {
        return {
            type: 'literal',
            dataType: 'boolean',
            value: trimmed.toLowerCase() === 'true'
        };
    }

    // Null
    if (/^null$/i.test(trimmed)) {
        return {
            type: 'literal',
            dataType: 'null',
            value: null
        };
    }

    // Number
    if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) {
        return {
            type: 'literal',
            dataType: 'number',
            value: Number(trimmed)
        };
    }

    // Fallback: treat as string without quotes
    return {
        type: 'literal',
        dataType: 'string',
        value: trimmed
    };
}

/**
 * Check if input contains a comparison operator
 */
export function isComparison(input: string): boolean {
    return parseComparison(input) !== null;
}
