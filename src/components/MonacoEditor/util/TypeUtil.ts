export function getType(): Array<string> {
    return [...getCoreType(), ...getCompoundType(), ...getMapType(), ...getSpecialType()];
}

export function getCoreType(): Array<string> {
    return [...getCoreStringType(), ...getCoreNumberType(), "range", "boolean", "binary"];
}

export function getCoreStringType(): Array<string> {
    return ["string", "text", "keyword", "date"]
}

export function getCoreNumberType(): Array<string> {
    return ["integer", "long", "short", "byte",
        "double", "float", "half_float", "scaled_float"]
}

export function getCompoundType(): Array<string> {
    return ["array", "object", "nested"];
}

export function getMapType(): Array<string> {
    return ["geo_point", "geo_shape"];
}

export function getSpecialType(): Array<string> {
    return ["ip", "completion", "token_count", "attachment", "percolator"]
}