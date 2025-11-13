// New modular CQL2 parser
import { ASTNode, SQLResult } from '../types/ast';
import { sanitizeInput, validateCQL2Syntax } from '../security/sanitizer';
import { parseComparison } from '../operators/comparison';
import { buildSQL } from '../translator/sqlBuilder';

export function parseCQL2(text: string): SQLResult {
    // Security checks
    sanitizeInput(text);
    validateCQL2Syntax(text);
    
    // Parse to AST
    const ast = parseToAST(text);
    
    // Convert AST to SQL
    return buildSQL(ast);
}

function parseToAST(text: string): ASTNode {
    const trimmed = text.trim();
    
    // Try parsing as comparison operator
    const comparisonNode = parseComparison(trimmed);
    if (comparisonNode) {
        return comparisonNode;
    }
    
    // TODO: Add support for logical operators (AND, OR, NOT)
    // TODO: Add support for spatial operators
    // TODO: Add support for temporal operators
    
    throw new Error(`Unable to parse CQL2 filter: ${text}`);
}