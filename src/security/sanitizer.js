"use strict";
// Input sanitization for SQL injection protection
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeInput = sanitizeInput;
exports.validateCQL2Syntax = validateCQL2Syntax;
/**
 * Check for suspicious SQL injection patterns
 * Throws error if dangerous characters detected
 */
function sanitizeInput(input) {
    var trimmed = input.trim();
    // Check for SQL injection patterns
    var dangerousPatterns = [
        ';', // Statement separator
        '--', // SQL comment
        '/*', // Multi-line comment start
        '*/', // Multi-line comment end
        'xp_', // SQL Server extended procedures
        'sp_', // SQL Server stored procedures
    ];
    for (var _i = 0, dangerousPatterns_1 = dangerousPatterns; _i < dangerousPatterns_1.length; _i++) {
        var pattern = dangerousPatterns_1[_i];
        if (trimmed.includes(pattern)) {
            throw new Error("Invalid CQL2 syntax: suspicious characters detected (".concat(pattern, ")"));
        }
    }
}
/**
 * Validate that a string is a valid CQL2 filter
 * Basic syntax checks
 */
function validateCQL2Syntax(input) {
    if (!input || input.trim().length === 0) {
        throw new Error('Empty CQL2 filter');
    }
    // Check for balanced quotes
    var singleQuotes = (input.match(/'/g) || []).length;
    var doubleQuotes = (input.match(/"/g) || []).length;
    if (singleQuotes % 2 !== 0) {
        throw new Error('Unbalanced single quotes in CQL2 filter');
    }
    if (doubleQuotes % 2 !== 0) {
        throw new Error('Unbalanced double quotes in CQL2 filter');
    }
    // Check for balanced parentheses
    var parenCount = 0;
    for (var _i = 0, input_1 = input; _i < input_1.length; _i++) {
        var char = input_1[_i];
        if (char === '(')
            parenCount++;
        if (char === ')')
            parenCount--;
        if (parenCount < 0) {
            throw new Error('Unbalanced parentheses in CQL2 filter');
        }
    }
    if (parenCount !== 0) {
        throw new Error('Unbalanced parentheses in CQL2 filter');
    }
}
