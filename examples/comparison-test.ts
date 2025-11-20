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

// LIKE
const filter6 = "title LIKE 'Sentinel%'";
const result6 = parseCQL2(filter6);
console.log('Filter 6:', filter6);
console.log('SQL:', result6.sql);
console.log('Values:', result6.values);
console.log();

// IN (numbers)
const filter7 = 'id IN (1, 2, 3)';
const result7 = parseCQL2(filter7);
console.log('Filter 7:', filter7);
console.log('SQL:', result7.sql);
console.log('Values:', result7.values);
console.log();

// IN (strings)
const filter8 = "title IN ('A', 'B', 'C')";
const result8 = parseCQL2(filter8);
console.log('Filter 8:', filter8);
console.log('SQL:', result8.sql);
console.log('Values:', result8.values);
console.log();

// BETWEEN (numbers)
const filter9 = 'price BETWEEN 10 AND 100';
const result9 = parseCQL2(filter9);
console.log('Filter 9:', filter9);
console.log('SQL:', result9.sql);
console.log('Values:', result9.values);
console.log();

// BETWEEN (strings)
const filter10 = "title BETWEEN 'A' AND 'Z'";
const result10 = parseCQL2(filter10);
console.log('Filter 10:', filter10);
console.log('SQL:', result10.sql);
console.log('Values:', result10.values);
console.log();

