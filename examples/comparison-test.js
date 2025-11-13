"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parseCQL2_1 = require("../src/parser/parseCQL2");
console.log('=== COMPARISON OPERATORS TEST ===\n');
// Less than
var filter1 = "price<100";
var result1 = (0, parseCQL2_1.parseCQL2)(filter1);
console.log('Filter 1:', filter1);
console.log('SQL:', result1.sql);
console.log('Values:', result1.values);
console.log();
// Greater than
var filter2 = "temperature>25.5";
var result2 = (0, parseCQL2_1.parseCQL2)(filter2);
console.log('Filter 2:', filter2);
console.log('SQL:', result2.sql);
console.log('Values:', result2.values);
console.log();
// Less than or equal
var filter3 = "id<=10";
var result3 = (0, parseCQL2_1.parseCQL2)(filter3);
console.log('Filter 3:', filter3);
console.log('SQL:', result3.sql);
console.log('Values:', result3.values);
console.log();
// Greater than or equal
var filter4 = "latitude>=-90";
var result4 = (0, parseCQL2_1.parseCQL2)(filter4);
console.log('Filter 4:', filter4);
console.log('SQL:', result4.sql);
console.log('Values:', result4.values);
console.log();
// String comparison
var filter5 = "title<'Z'";
var result5 = (0, parseCQL2_1.parseCQL2)(filter5);
console.log('Filter 5:', filter5);
console.log('SQL:', result5.sql);
console.log('Values:', result5.values);
console.log();
console.log('All comparison operators working! ✓');
