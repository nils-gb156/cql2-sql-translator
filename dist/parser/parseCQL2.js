"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCQL2 = parseCQL2;
const sanitizer_1 = require("../security/sanitizer");
const comparison_1 = require("../operators/comparison");
const logical_1 = require("../operators/logical");
const sqlBuilder_1 = require("../translator/sqlBuilder");
function parseCQL2(text) {
    // Security checks
    (0, sanitizer_1.sanitizeInput)(text);
    (0, sanitizer_1.validateCQL2Syntax)(text);
    // Parse to AST
    const ast = parseToAST(text);
    // Convert AST to SQL
    return (0, sqlBuilder_1.buildSQL)(ast);
}
function parseToAST(text) {
    const trimmed = text.trim();
    // 1) Try full logical parser (which also handles pure comparisons)
    const logicalOrComparison = (0, logical_1.parseLogical)(trimmed);
    if (logicalOrComparison) {
        return logicalOrComparison;
    }
    // 2) Fallback: direct comparison (should normally be covered above)
    const comparisonNode = (0, comparison_1.parseComparison)(trimmed);
    if (comparisonNode) {
        return comparisonNode;
    }
    // TODO: Add support for spatial and temporal operators
    throw new Error(`Unable to parse CQL2 filter: ${text}`);
}
//# sourceMappingURL=parseCQL2.js.map