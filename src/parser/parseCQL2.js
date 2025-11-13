"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCQL2 = parseCQL2;
var sanitizer_1 = require("../security/sanitizer");
var comparison_1 = require("../operators/comparison");
var sqlBuilder_1 = require("../translator/sqlBuilder");
function parseCQL2(text) {
    // Security checks
    (0, sanitizer_1.sanitizeInput)(text);
    (0, sanitizer_1.validateCQL2Syntax)(text);
    // Parse to AST
    var ast = parseToAST(text);
    // Convert AST to SQL
    return (0, sqlBuilder_1.buildSQL)(ast);
}
function parseToAST(text) {
    var trimmed = text.trim();
    // Try parsing as comparison operator
    var comparisonNode = (0, comparison_1.parseComparison)(trimmed);
    if (comparisonNode) {
        return comparisonNode;
    }
    // TODO: Add support for logical operators (AND, OR, NOT)
    // TODO: Add support for spatial operators
    // TODO: Add support for temporal operators
    throw new Error("Unable to parse CQL2 filter: ".concat(text));
}
