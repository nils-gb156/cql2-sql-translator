// SQL Builder - converts AST to SQL

import { ASTNode, ComparisonNode, LogicalNode, SQLResult, LiteralNode } from '../types/ast';
import { escapeIdentifier } from '../security/validator';

/**
 * Convert AST to SQL with parameter binding
 */
export function buildSQL(node: ASTNode): SQLResult {
    switch (node.type) {
        case 'comparison':
            return buildComparison(node);
        case 'logical':
            return buildLogical(node);
        case 'spatial':
            throw new Error('Spatial operators not yet implemented');
        case 'temporal':
            throw new Error('Temporal operators not yet implemented');
        default:
            throw new Error(`Unknown node type: ${(node as any).type}`);
    }
}

function buildComparison(node: ComparisonNode): SQLResult {
    const fieldName = escapeIdentifier(node.field);
    const value = Array.isArray(node.value)
        ? node.value.map(v => v.value)
        : (node.value as LiteralNode).value;
    
    // Special handling for NULL (only for single literal)
    if (!Array.isArray(node.value) && node.value.dataType === 'null') {
        if (node.operator === '=') {
            return {
                sql: `WHERE ${fieldName} IS NULL`,
                values: []
            };
        } else if (node.operator === '!=') {
            return {
                sql: `WHERE ${fieldName} IS NOT NULL`,
                values: []
            };
        } else {
            throw new Error(`Cannot use operator ${node.operator} with NULL`);
        }
    }

    // LIKE
    if (node.operator === 'LIKE') {
        return {
            sql: `WHERE ${fieldName} LIKE $1`,
            values: [value]
        };
    }

    // IN
    if (node.operator === 'IN') {
        if (!Array.isArray(node.value) || node.value.length === 0) {
            throw new Error('IN operator requires a non-empty list');
        }
        const placeholders = node.value.map((_, idx) => `$${idx + 1}`).join(', ');
        return {
            sql: `WHERE ${fieldName} IN (${placeholders})`,
            values: value as any[]
        };
    }

    // BETWEEN
    if (node.operator === 'BETWEEN') {
        if (!Array.isArray(node.value) || node.value.length !== 2) {
            throw new Error('BETWEEN operator requires exactly two values');
        }
        return {
            sql: `WHERE ${fieldName} BETWEEN $1 AND $2`,
            values: value as any[]
        };
    }

    // Standard comparison with parameter binding
    return {
        sql: `WHERE ${fieldName} ${node.operator} $1`,
        values: [value]
    };
}

function buildLogical(node: LogicalNode): SQLResult {
    if (node.operator === 'NOT') {
        if (node.operands.length !== 1) {
            throw new Error('NOT operator requires exactly one operand');
        }
        const operand = buildSQL(node.operands[0]);
        return {
            sql: `WHERE NOT (${operand.sql.replace(/^WHERE\s+/i, '')})`,
            values: operand.values
        };
    }
    
    if (node.operands.length < 2) {
        throw new Error(`${node.operator} operator requires at least two operands`);
    }
    
    const results = node.operands.map(op => buildSQL(op));
    const conditions = results.map(r => r.sql.replace(/^WHERE\s+/i, ''));
    const allValues: any[] = [];
    
    // Renumber parameters across multiple operands
    let paramIndex = 1;
    const renumberedConditions = conditions.map((condition, idx) => {
        const result = results[idx];
        let renumbered = condition;
        
        // Replace $1, $2, etc. with new parameter numbers
        for (let i = result.values.length; i >= 1; i--) {
            renumbered = renumbered.replace(
                new RegExp(`\\$${i}\\b`, 'g'),
                `$${paramIndex + i - 1}`
            );
        }
        
        paramIndex += result.values.length;
        allValues.push(...result.values);
        
        return renumbered;
    });
    
    const joined = renumberedConditions.join(` ${node.operator} `);
    
    return {
        sql: `WHERE ${joined}`,
        values: allValues
    };
}
