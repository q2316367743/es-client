import Index from '@/view/Index';
import Strategy from "../Strategy";

export default class DocStrategyImpl implements Strategy {

    issue(): any {
        return {
            "$id": "schema_search.json",
            "$schema": "https://esion.xyz/assert/es-client/schema_search.json",
            "type": "object",
            "properties": {}
        }
    }
}