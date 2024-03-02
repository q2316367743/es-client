export function jsonFormat(json: string | object): string {
    return JSON.stringify(typeof json === 'string' ? JSON.parse(json) : json, null, 4);

}
