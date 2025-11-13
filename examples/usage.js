"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parseCQL2_1 = require("../src/parser/parseCQL2");
// String mit single quotes
var filter1 = "title='Sentinel-2A'";
var result1 = (0, parseCQL2_1.parseCQL2)(filter1);
console.log('Filter 1:', filter1);
console.log('SQL:', result1.sql);
console.log('Values:', result1.values);
console.log();
// Number
var filter2 = "id=1";
var result2 = (0, parseCQL2_1.parseCQL2)(filter2);
console.log('Filter 2:', filter2);
console.log('SQL:', result2.sql);
console.log('Values:', result2.values);
console.log();
// String mit double quotes
var filter3 = 'url="https://example.com"';
var result3 = (0, parseCQL2_1.parseCQL2)(filter3);
console.log('Filter 3:', filter3);
console.log('SQL:', result3.sql);
console.log('Values:', result3.values);
console.log();
// Boolean true
var filter4 = "active=true";
var result4 = (0, parseCQL2_1.parseCQL2)(filter4);
console.log('Filter 4:', filter4);
console.log('SQL:', result4.sql);
console.log('Values:', result4.values);
console.log();
// Boolean false
var filter5 = "visible=false";
var result5 = (0, parseCQL2_1.parseCQL2)(filter5);
console.log('Filter 5:', filter5);
console.log('SQL:', result5.sql);
console.log('Values:', result5.values);
console.log();
// Null
var filter6 = "description=null";
var result6 = (0, parseCQL2_1.parseCQL2)(filter6);
console.log('Filter 6:', filter6);
console.log('SQL:', result6.sql);
console.log('Values:', result6.values);
console.log();
// Decimal number
var filter7 = "price=19.99";
var result7 = (0, parseCQL2_1.parseCQL2)(filter7);
console.log('Filter 7:', filter7);
console.log('SQL:', result7.sql);
console.log('Values:', result7.values);
console.log();
// Negative number
var filter8 = "temperature=-10";
var result8 = (0, parseCQL2_1.parseCQL2)(filter8);
console.log('Filter 8:', filter8);
console.log('SQL:', result8.sql);
console.log('Values:', result8.values);
console.log();
// Property path with dot notation
var filter9 = "properties.category='satellite'";
var result9 = (0, parseCQL2_1.parseCQL2)(filter9);
console.log('Filter 9:', filter9);
console.log('SQL:', result9.sql);
console.log('Values:', result9.values);
console.log();
// Property path with bracket notation
var filter10 = "properties['type']='imagery'";
var result10 = (0, parseCQL2_1.parseCQL2)(filter10);
console.log('Filter 10:', filter10);
console.log('SQL:', result10.sql);
console.log('Values:', result10.values);
console.log();
console.log('--- NOT EQUAL Tests ---');
// String not equal
var filter11 = "title!='Test'";
var result11 = (0, parseCQL2_1.parseCQL2)(filter11);
console.log('Filter 11:', filter11);
console.log('SQL:', result11.sql);
console.log('Values:', result11.values);
console.log();
// Number not equal
var filter12 = "id!=5";
var result12 = (0, parseCQL2_1.parseCQL2)(filter12);
console.log('Filter 12:', filter12);
console.log('SQL:', result12.sql);
console.log('Values:', result12.values);
console.log();
// Boolean not equal
var filter13 = "active!=false";
var result13 = (0, parseCQL2_1.parseCQL2)(filter13);
console.log('Filter 13:', filter13);
console.log('SQL:', result13.sql);
console.log('Values:', result13.values);
console.log();
// Not null
var filter14 = "description!=null";
var result14 = (0, parseCQL2_1.parseCQL2)(filter14);
console.log('Filter 14:', filter14);
console.log('SQL:', result14.sql);
console.log('Values:', result14.values);
console.log();
// Decimal not equal
var filter15 = "price!=99.99";
var result15 = (0, parseCQL2_1.parseCQL2)(filter15);
console.log('Filter 15:', filter15);
console.log('SQL:', result15.sql);
console.log('Values:', result15.values);
console.log();
// Test SQL Injection attempt (will be blocked)
console.log('--- SQL Injection Test ---');
try {
    var maliciousFilter = "id=1; DROP TABLE users--";
    var resultBad = (0, parseCQL2_1.parseCQL2)(maliciousFilter);
    console.log('DANGER: Injection succeeded!', resultBad);
}
catch (error) {
    console.log('✓ SQL Injection blocked:', error instanceof Error ? error.message : String(error));
}
