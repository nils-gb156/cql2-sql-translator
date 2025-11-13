export function parseCQL2(text: string): { sql: string; values: any[] } {
    const match = text.match(/title\s*=\s*'(.*?)'/i);
    if (match) {
        return {
            sql: 'WHERE title = $1',
            values: [match[1]]
        };
    }
    return { sql: '', values: [] };
}