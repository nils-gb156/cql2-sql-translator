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

// Test SQL Injection attempt (will be blocked)
console.log('--- SQL Injection Test ---');
try {
    const maliciousFilter = "id=1; DROP TABLE users--";
    const resultBad = parseCQL2(maliciousFilter);
    console.log('DANGER: Injection succeeded!', resultBad);
} catch (error) {
    console.log('✓ SQL Injection blocked:', error instanceof Error ? error.message : String(error));
}
