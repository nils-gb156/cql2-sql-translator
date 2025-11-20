// Abstract Syntax Tree types for CQL2

export type ASTNode = 
    | ComparisonNode
    | LogicalNode
    | SpatialNode
    | TemporalNode
    | LiteralNode;

export interface ComparisonNode {
    type: 'comparison';
    operator: '=' | '!=' | '<' | '>' | '<=' | '>=' | 'LIKE' | 'IN' | 'BETWEEN';
    field: string;
    // For IN and BETWEEN we may need multiple values
    value: LiteralNode | LiteralNode[];
}

export interface LogicalNode {
    type: 'logical';
    operator: 'AND' | 'OR' | 'NOT';
    operands: ASTNode[];
}

export interface SpatialNode {
    type: 'spatial';
    operator: 'INTERSECTS' | 'CONTAINS' | 'WITHIN' | 'OVERLAPS';
    field: string;
    geometry: GeoJSONGeometry;
}

export interface TemporalNode {
    type: 'temporal';
    operator: 'BEFORE' | 'AFTER' | 'DURING';
    field: string;
    datetime: string | [string, string];
}

export interface LiteralNode {
    type: 'literal';
    dataType: 'string' | 'number' | 'boolean' | 'null';
    value: string | number | boolean | null;
}

// GeoJSON Geometry types (simplified)
export interface GeoJSONGeometry {
    type: 'Point' | 'LineString' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon';
    coordinates: number[] | number[][] | number[][][];
}

// SQL Output
export interface SQLResult {
    sql: string;
    values: any[];
}
