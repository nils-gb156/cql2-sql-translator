import { parseCQL2 } from '../src/parser/parseCQL2';

// String mit single quotes
const filter1 = "title='Sentinel-2A'";
const result1 = parseCQL2(filter1);
console.log('Filter 1:', filter1);
console.log('SQL:', result1.sql);
console.log('Values:', result1.values);
console.log();

// Number
const filter2 = "id=1";
const result2 = parseCQL2(filter2);
console.log('Filter 2:', filter2);
console.log('SQL:', result2.sql);
console.log('Values:', result2.values);
console.log();

// String mit double quotes
const filter3 = 'url="https://example.com"';
const result3 = parseCQL2(filter3);
console.log('Filter 3:', filter3);
console.log('SQL:', result3.sql);
console.log('Values:', result3.values);
console.log();

// Boolean true
const filter4 = "active=true";
const result4 = parseCQL2(filter4);
console.log('Filter 4:', filter4);
console.log('SQL:', result4.sql);
console.log('Values:', result4.values);
console.log();

// Boolean false
const filter5 = "visible=false";
const result5 = parseCQL2(filter5);
console.log('Filter 5:', filter5);
console.log('SQL:', result5.sql);
console.log('Values:', result5.values);
console.log();

// Null
const filter6 = "description=null";
const result6 = parseCQL2(filter6);
console.log('Filter 6:', filter6);
console.log('SQL:', result6.sql);
console.log('Values:', result6.values);
console.log();

// Decimal number
const filter7 = "price=19.99";
const result7 = parseCQL2(filter7);
console.log('Filter 7:', filter7);
console.log('SQL:', result7.sql);
console.log('Values:', result7.values);
console.log();

// Negative number
const filter8 = "temperature=-10";
const result8 = parseCQL2(filter8);
console.log('Filter 8:', filter8);
console.log('SQL:', result8.sql);
console.log('Values:', result8.values);
console.log();

// Property path with dot notation
const filter9 = "properties.category='satellite'";
const result9 = parseCQL2(filter9);
console.log('Filter 9:', filter9);
console.log('SQL:', result9.sql);
console.log('Values:', result9.values);
console.log();

// Property path with bracket notation
const filter10 = "properties['type']='imagery'";
const result10 = parseCQL2(filter10);
console.log('Filter 10:', filter10);
console.log('SQL:', result10.sql);
console.log('Values:', result10.values);
console.log();

console.log('--- NOT EQUAL Tests ---');

// String not equal
const filter11 = "title!='Test'";
const result11 = parseCQL2(filter11);
console.log('Filter 11:', filter11);
console.log('SQL:', result11.sql);
console.log('Values:', result11.values);
console.log();

// Number not equal
const filter12 = "id!=5";
const result12 = parseCQL2(filter12);
console.log('Filter 12:', filter12);
console.log('SQL:', result12.sql);
console.log('Values:', result12.values);
console.log();

// Boolean not equal
const filter13 = "active!=false";
const result13 = parseCQL2(filter13);
console.log('Filter 13:', filter13);
console.log('SQL:', result13.sql);
console.log('Values:', result13.values);
console.log();

// Not null
const filter14 = "description!=null";
const result14 = parseCQL2(filter14);
console.log('Filter 14:', filter14);
console.log('SQL:', result14.sql);
console.log('Values:', result14.values);
console.log();

// Decimal not equal
const filter15 = "price!=99.99";
const result15 = parseCQL2(filter15);
console.log('Filter 15:', filter15);
console.log('SQL:', result15.sql);
console.log('Values:', result15.values);
console.log();

// Test SQL Injection attempt (will be blocked)
console.log('--- SQL Injection Test ---');
try {
    const maliciousFilter = "id=1; DROP TABLE users--";
    const resultBad = parseCQL2(maliciousFilter);
    console.log('DANGER: Injection succeeded!', resultBad);
} catch (error) {
    console.log('✓ SQL Injection blocked:', error instanceof Error ? error.message : String(error));
}
