import { ASTNode, ComparisonNode, LogicalNode } from '../types/ast';
import { parseComparison } from './comparison';

// Parse logical expressions with AND / OR / NOT and parentheses.
// This is a minimal parser that splits on top-level AND/OR and supports unary NOT.

export function parseLogical(input: string): ASTNode | null {
    const trimmed = input.trim();

    // 1) Strip outer parentheses if they wrap the whole expression
    const withoutOuter = stripOuterParens(trimmed);

    // 2) Try to split on top-level AND / OR
    const orParts = splitTopLevel(withoutOuter, 'OR');
    if (orParts.length > 1) {
        const operands = orParts.map(part => parseLogicalOrComparison(part.trim()));
        return {
            type: 'logical',
            operator: 'OR',
            operands
        } as LogicalNode;
    }

    // Important: do not split BETWEEN ... AND ...
    // If BETWEEN is present at top level, we let the comparison parser handle it.
    if (/\bBETWEEN\b/i.test(withoutOuter)) {
        const comparison = parseComparison(withoutOuter);
        if (comparison) {
            return comparison;
        }
    }

    const andParts = splitTopLevel(withoutOuter, 'AND');
    if (andParts.length > 1) {
        const operands = andParts.map(part => parseLogicalOrComparison(part.trim()));
        return {
            type: 'logical',
            operator: 'AND',
            operands
        } as LogicalNode;
    }

    // 3) Unary NOT
    if (/^NOT\s+/i.test(withoutOuter)) {
        const rest = withoutOuter.replace(/^NOT\s+/i, '');
        const operand = parseLogicalOrComparison(rest.trim());
        return {
            type: 'logical',
            operator: 'NOT',
            operands: [operand]
        } as LogicalNode;
    }

    // 4) Fallback: just a comparison
    const comparison = parseComparison(withoutOuter);
    return comparison;
}

function parseLogicalOrComparison(text: string): ASTNode {
    const comparison = parseComparison(text);
    if (comparison) return comparison;

    const logical = parseLogical(text);
    if (logical) return logical;

    throw new Error(`Unable to parse logical/comparison expression: ${text}`);
}

// Strip one layer of outer parentheses if they enclose the whole expression
function stripOuterParens(text: string): string {
    if (!text.startsWith('(') || !text.endsWith(')')) return text;

    let depth = 0;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === '(') depth++;
        else if (ch === ')') depth--;

        // If depth is 0 before the last char, outer parens don't wrap everything
        if (depth === 0 && i < text.length - 1) {
            return text;
        }
    }
    // Outer parens wrap entire expression
    return text.substring(1, text.length - 1).trim();
}

// Split by a logical operator at top level (not inside parentheses)
function splitTopLevel(text: string, operator: 'AND' | 'OR'): string[] {
    const parts: string[] = [];
    let depth = 0;
    let lastIndex = 0;
    const upper = text.toUpperCase();
    const op = ` ${operator} `;

    for (let i = 0; i < upper.length; i++) {
        const ch = upper[i];
        if (ch === '(') depth++;
        else if (ch === ')') depth--;

        if (depth === 0 && upper.startsWith(op, i)) {
            parts.push(text.slice(lastIndex, i));
            lastIndex = i + op.length;
        }
    }

    if (lastIndex === 0) return [text];

    parts.push(text.slice(lastIndex));
    return parts;
}
