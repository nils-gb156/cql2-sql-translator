import { parseCQL2 } from '../src/parser/parseCQL2';

console.log('=== LOGICAL OPERATORS TEST ===\n');

// AND
const filter1 = "price<100 AND active=true";
const result1 = parseCQL2(filter1);
console.log('Filter 1:', filter1);
console.log('SQL:', result1.sql);
console.log('Values:', result1.values);
console.log();

// OR
const filter2 = "id=1 OR id=2";
const result2 = parseCQL2(filter2);
console.log('Filter 2:', filter2);
console.log('SQL:', result2.sql);
console.log('Values:', result2.values);
console.log();

// AND + OR with parentheses
const filter3 = "(id=1 OR id=2) AND active=true";
const result3 = parseCQL2(filter3);
console.log('Filter 3:', filter3);
console.log('SQL:', result3.sql);
console.log('Values:', result3.values);
console.log();

// NOT
const filter4 = "NOT active=true";
const result4 = parseCQL2(filter4);
console.log('Filter 4:', filter4);
console.log('SQL:', result4.sql);
console.log('Values:', result4.values);
console.log();

// NOT with parentheses
const filter5 = "NOT (price>=100 AND active=false)";
const result5 = parseCQL2(filter5);
console.log('Filter 5:', filter5);
console.log('SQL:', result5.sql);
console.log('Values:', result5.values);
console.log();

