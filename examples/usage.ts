import { parseCQL2 } from '../src/parser/parseCQL2';

const filter = "title='Sentinel-2A'";
const result = parseCQL2(filter);

console.log('SQL:', result.sql);
console.log('Values:', result.values);
