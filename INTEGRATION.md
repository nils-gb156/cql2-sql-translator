# STAC API Integration Guide

## Installation

### Option 1: Lokales npm Package (Development)

In deinem STAC API Projekt:

```bash
npm install ../cql2-sql-translator
```

### Option 2: npm link (Development)

Im cql2-sql-translator Verzeichnis:
```bash
npm link
```

In deinem STAC API Projekt:
```bash
npm link cql2-sql-translator
```

### Option 3: Von GitHub installieren

```bash
# Dev-Branch (aktuell)
npm install git+https://github.com/nils-gb156/cql2-sql-translator.git#dev

# Main-Branch (später nach Merge)
npm install git+https://github.com/nils-gb156/cql2-sql-translator.git#main
```

## Verwendung in deiner STAC API

### Basis-Integration

```typescript
import { parseCQL2, allowField } from 'cql2-sql-translator';
import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  database: 'stac',
  user: 'postgres',
  password: 'password'
});

// Optional: Eigene Felder zur Whitelist hinzufügen
allowField('custom_field');
allowField('properties.custom_property');

// API Route Handler (Express Beispiel)
app.get('/collections/search', async (req, res) => {
  try {
    const cql2Filter = req.query.filter; // z.B. "title='Sentinel-2A'"
    
    if (!cql2Filter) {
      return res.status(400).json({ error: 'Filter required' });
    }
    
    // CQL2 zu SQL konvertieren
    const { sql, values } = parseCQL2(cql2Filter);
    
    // SQL Query ausführen
    const query = `
      SELECT * FROM collections
      ${sql}
      LIMIT 100
    `;
    
    const result = await pool.query(query, values);
    
    res.json({
      collections: result.rows,
      matched: result.rowCount
    });
    
  } catch (error) {
    console.error('CQL2 parsing error:', error);
    res.status(400).json({ 
      error: 'Invalid CQL2 filter',
      details: error.message 
    });
  }
});
```

### Mit Fastify

```typescript
import { parseCQL2 } from 'cql2-sql-translator';
import Fastify from 'fastify';

const fastify = Fastify();

fastify.get('/collections/search', async (request, reply) => {
  const { filter } = request.query as { filter?: string };
  
  if (!filter) {
    return reply.code(400).send({ error: 'Filter required' });
  }
  
  try {
    const { sql, values } = parseCQL2(filter);
    
    const result = await fastify.pg.query(
      `SELECT * FROM collections ${sql}`,
      values
    );
    
    return { collections: result.rows };
  } catch (error) {
    return reply.code(400).send({ 
      error: 'Invalid CQL2 filter',
      details: error.message 
    });
  }
});
```

### Mit TypeORM

```typescript
import { parseCQL2 } from 'cql2-sql-translator';
import { getRepository } from 'typeorm';
import { Collection } from './entities/Collection';

async function searchCollections(cql2Filter: string) {
  const { sql, values } = parseCQL2(cql2Filter);
  
  const repository = getRepository(Collection);
  
  // TypeORM raw query
  const collections = await repository
    .createQueryBuilder('collection')
    .where(sql.replace('WHERE ', ''), values)
    .getMany();
  
  return collections;
}
```

## Test-Beispiele

```typescript
// Einfache Gleichheit
parseCQL2("title='Sentinel-2A'")
// WHERE "title" = $1, values: ['Sentinel-2A']

// Vergleich
parseCQL2("price<100")
// WHERE "price" < $1, values: [100]

// LIKE Pattern Matching
parseCQL2("title LIKE 'Sentinel%'")
// WHERE "title" LIKE $1, values: ['Sentinel%']

// IN Liste
parseCQL2("id IN (1, 2, 3)")
// WHERE "id" IN ($1, $2, $3), values: [1, 2, 3]

// BETWEEN Bereich
parseCQL2("price BETWEEN 10 AND 100")
// WHERE "price" BETWEEN $1 AND $2, values: [10, 100]

// Logische Operatoren
parseCQL2("id=8 AND active=true")
// WHERE "id" = $1 AND "active" = $2, values: [8, true]

parseCQL2("price<100 OR active=false")
// WHERE "price" < $1 OR "active" = $2, values: [100, false]

parseCQL2("NOT active=true")
// WHERE NOT ("active" = $1), values: [true]

// Null-Check
parseCQL2("description!=null")
// WHERE "description" IS NOT NULL, values: []

// Property Path
parseCQL2("properties.category='satellite'")
// WHERE "properties.category" = $1, values: ['satellite']
```

## Error Handling

Die Bibliothek wirft Fehler bei:
- Ungültigen Feldnamen (nicht in Whitelist)
- SQL Injection Versuchen
- Ungültiger CQL2 Syntax

```typescript
try {
  const result = parseCQL2(userInput);
} catch (error) {
  if (error.message.includes('Invalid field name')) {
    // Feld nicht erlaubt
  } else if (error.message.includes('suspicious characters')) {
    // SQL Injection Versuch
  } else {
    // Andere Parsing-Fehler
  }
}
```

## Aktuell unterstützte Features

✅ **Vergleichsoperatoren**: `=`, `!=`, `<`, `>`, `<=`, `>=`  
✅ **Pattern Matching**: `LIKE`  
✅ **Listen**: `IN`  
✅ **Bereiche**: `BETWEEN`  
✅ **Logische Operatoren**: `AND`, `OR`, `NOT`  
✅ **Datentypen**: Strings, Zahlen, Booleans, Null  
✅ **Property Paths**: `properties.field`, `properties['field']`

## Noch nicht implementiert

⏳ Räumliche Filter (`INTERSECTS`, `CONTAINS`, etc.)  
⏳ Zeitliche Filter (`BEFORE`, `AFTER`, `DURING`)  
⏳ Erweiterte Pattern (`STARTS WITH`, `ENDS WITH`)  
⏳ Array-Operatoren für JSONB-Felder
