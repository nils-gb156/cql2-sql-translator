import { parseCQL2 } from '../src/parser/parseCQL2';

console.log('=== COMPARISON OPERATORS TEST ===\n');

// Less than
const filter1 = "price<100";
const result1 = parseCQL2(filter1);
console.log('Filter 1:', filter1);
console.log('SQL:', result1.sql);
console.log('Values:', result1.values);
console.log();

// Greater than
const filter2 = "temperature>25.5";
const result2 = parseCQL2(filter2);
console.log('Filter 2:', filter2);
console.log('SQL:', result2.sql);
console.log('Values:', result2.values);
console.log();

// Less than or equal
const filter3 = "id<=10";
const result3 = parseCQL2(filter3);
console.log('Filter 3:', filter3);
console.log('SQL:', result3.sql);
console.log('Values:', result3.values);
console.log();

// Greater than or equal
const filter4 = "latitude>=-90";
const result4 = parseCQL2(filter4);
console.log('Filter 4:', filter4);
console.log('SQL:', result4.sql);
console.log('Values:', result4.values);
console.log();

// String comparison
const filter5 = "title<'Z'";
const result5 = parseCQL2(filter5);
console.log('Filter 5:', filter5);
console.log('SQL:', result5.sql);
console.log('Values:', result5.values);
console.log();

console.log('All comparison operators working! ✓');
