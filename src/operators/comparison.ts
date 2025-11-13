// Comparison operators: =, !=, <, >, <=, >=

import { ComparisonNode, LiteralNode } from '../types/ast';

/**
 * Parse comparison operators
 * Supports: =, !=, <, >, <=, >=
 */
export function parseComparison(input: string): ComparisonNode | null {
    // Try each operator pattern (order matters: check <= before <, >= before >)
    const operators = ['<=', '>=', '!=', '=', '<', '>'] as const;
    
    for (const operator of operators) {
        const result = tryParseOperator(input, operator);
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

/**
 * Check if input contains a comparison operator
 */
export function isComparison(input: string): boolean {
    return parseComparison(input) !== null;
}
