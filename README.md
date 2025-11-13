# cql2-sql-translator

**Node.js-Bibliothek zur Übersetzung von CQL2-Textfiltern in SQL-Abfragen für STAC Collection-Search.**

Diese Bibliothek ermöglicht die Verarbeitung von CQL2-kompatiblen Filterausdrücken und deren Übersetzung in SQL-Statements, die direkt auf STAC Collection-Properties angewendet werden können. Unterstützt werden logische, vergleichende, räumliche und zeitliche Operatoren gemäß der STAC API Collection Search Extension.

## Features

- Unterstützung für grundlegende Operatoren: `=`, `!=`, `<`, `>`, `LIKE`, `IN`, `BETWEEN`
- Logische Verknüpfungen: `AND`, `OR`, `NOT`
- Räumliche Filter (PostGIS): `INTERSECTS`, `CONTAINS`, `OVERLAPS`
- Zeitliche Filter: `BEFORE`, `AFTER`, `DURING`
- Ausgabe als SQL-Query mit Parameterbindung
- TypeScript-Support
- Unit-Tests mit Jest

## Installation

```bash
npm install git+https://github.com/nils-gb156/cql2-sql-translator.git#dev
