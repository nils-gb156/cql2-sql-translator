"use strict";
// Comparison operators: =, !=, <, >, <=, >=
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseComparison = parseComparison;
exports.isComparison = isComparison;
/**
 * Parse comparison operators
 * Supports: =, !=, <, >, <=, >=
 */
function parseComparison(input) {
    // Try each operator pattern (order matters: check <= before <, >= before >)
    var operators = ['<=', '>=', '!=', '=', '<', '>'];
    for (var _i = 0, operators_1 = operators; _i < operators_1.length; _i++) {
        var operator = operators_1[_i];
        var result = tryParseOperator(input, operator);
        if (result) {
            return result;
        }
    }
    return null;
}
function tryParseOperator(input, operator) {
    // Escape special regex characters in operator
    var escapedOp = operator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match field operator 'value' (string with quotes)
    var regex = new RegExp("(\\w+(?:\\.\\w+|\\[['\"]?\\w+['\"]?\\])*)\\s*".concat(escapedOp, "\\s*(['\"])(.*?)\\2"), 'i');
    var match = input.match(regex);
    if (match) {
        return {
            type: 'comparison',
            operator: operator,
            field: match[1],
            value: {
                type: 'literal',
                dataType: 'string',
                value: match[3]
            }
        };
    }
    // Match field operator true/false (boolean)
    regex = new RegExp("(\\w+(?:\\.\\w+|\\[['\"]?\\w+['\"]?\\])*)\\s*".concat(escapedOp, "\\s*(true|false)"), 'i');
    match = input.match(regex);
    if (match) {
        return {
            type: 'comparison',
            operator: operator,
            field: match[1],
            value: {
                type: 'literal',
                dataType: 'boolean',
                value: match[2].toLowerCase() === 'true'
            }
        };
    }
    // Match field operator null
    regex = new RegExp("(\\w+(?:\\.\\w+|\\[['\"]?\\w+['\"]?\\])*)\\s*".concat(escapedOp, "\\s*null"), 'i');
    match = input.match(regex);
    if (match) {
        return {
            type: 'comparison',
            operator: operator,
            field: match[1],
            value: {
                type: 'literal',
                dataType: 'null',
                value: null
            }
        };
    }
    // Match field operator number (integer, decimal, negative)
    regex = new RegExp("(\\w+(?:\\.\\w+|\\[['\"]?\\w+['\"]?\\])*)\\s*".concat(escapedOp, "\\s*(-?\\d+(?:\\.\\d+)?)"), 'i');
    match = input.match(regex);
    if (match) {
        return {
            type: 'comparison',
            operator: operator,
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
function isComparison(input) {
    return parseComparison(input) !== null;
}
