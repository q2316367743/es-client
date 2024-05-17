import {jsonParse} from "@/plugins/native/axios";

export function jsonFormat(json: string | object): string {
    return JSON.stringify(typeof json === 'string' ? jsonParse(json) : json, null, 4);

}
