"use strict";
// Main entry point for cql2-sql-translator
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllowedFields = exports.allowField = exports.buildSQL = exports.parseCQL2 = void 0;
var parseCQL2_1 = require("./parser/parseCQL2");
Object.defineProperty(exports, "parseCQL2", { enumerable: true, get: function () { return parseCQL2_1.parseCQL2; } });
var sqlBuilder_1 = require("./translator/sqlBuilder");
Object.defineProperty(exports, "buildSQL", { enumerable: true, get: function () { return sqlBuilder_1.buildSQL; } });
var validator_1 = require("./security/validator");
Object.defineProperty(exports, "allowField", { enumerable: true, get: function () { return validator_1.allowField; } });
Object.defineProperty(exports, "getAllowedFields", { enumerable: true, get: function () { return validator_1.getAllowedFields; } });
//# sourceMappingURL=index.js.map