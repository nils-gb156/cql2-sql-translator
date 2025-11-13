"use strict";
// SQL Builder - converts AST to SQL
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSQL = buildSQL;
var validator_1 = require("../security/validator");
/**
 * Convert AST to SQL with parameter binding
 */
function buildSQL(node) {
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
            throw new Error("Unknown node type: ".concat(node.type));
    }
}
function buildComparison(node) {
    var fieldName = (0, validator_1.escapeIdentifier)(node.field);
    var value = node.value.value;
    // Special handling for NULL
    if (node.value.dataType === 'null') {
        if (node.operator === '=') {
            return {
                sql: "WHERE ".concat(fieldName, " IS NULL"),
                values: []
            };
        }
        else if (node.operator === '!=') {
            return {
                sql: "WHERE ".concat(fieldName, " IS NOT NULL"),
                values: []
            };
        }
        else {
            throw new Error("Cannot use operator ".concat(node.operator, " with NULL"));
        }
    }
    // Standard comparison with parameter binding
    return {
        sql: "WHERE ".concat(fieldName, " ").concat(node.operator, " $1"),
        values: [value]
    };
}
function buildLogical(node) {
    if (node.operator === 'NOT') {
        if (node.operands.length !== 1) {
            throw new Error('NOT operator requires exactly one operand');
        }
        var operand = buildSQL(node.operands[0]);
        return {
            sql: "WHERE NOT (".concat(operand.sql.replace(/^WHERE\s+/i, ''), ")"),
            values: operand.values
        };
    }
    if (node.operands.length < 2) {
        throw new Error("".concat(node.operator, " operator requires at least two operands"));
    }
    var results = node.operands.map(function (op) { return buildSQL(op); });
    var conditions = results.map(function (r) { return r.sql.replace(/^WHERE\s+/i, ''); });
    var allValues = [];
    // Renumber parameters across multiple operands
    var paramIndex = 1;
    var renumberedConditions = conditions.map(function (condition, idx) {
        var result = results[idx];
        var renumbered = condition;
        // Replace $1, $2, etc. with new parameter numbers
        for (var i = result.values.length; i >= 1; i--) {
            renumbered = renumbered.replace(new RegExp("\\$".concat(i, "\\b"), 'g'), "$".concat(paramIndex + i - 1));
        }
        paramIndex += result.values.length;
        allValues.push.apply(allValues, result.values);
        return renumbered;
    });
    var joined = renumberedConditions.join(" ".concat(node.operator, " "));
    return {
        sql: "WHERE ".concat(joined),
        values: allValues
    };
}
