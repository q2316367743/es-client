import Field from "@/view/Field";

export default function IndexFieldBuild(mappings: any): Array<Field> {
    let fields = new Array<Field>();
    let properties = {} as any;
    if (mappings._doc) {
        properties = mappings._doc.properties;
    } else if (mappings.doc) {
        properties = mappings.doc.properties;
    } else {
        return new Array<Field>();
    }
    let prefix = '';
    for (let key in properties) {
        buildField(key, properties[key], fields, prefix)
    }
    return fields;
}

function buildField(name: string, field: any, fields: Array<Field>, prefix: string): void {
    let realName = name
    if (prefix !== '') {
        realName = prefix + '.' + name;
    }
    if (field.fields) {
        // 如果存在`fields`字段，则代表这个字段是`text`类型+`keyword`类型
        fields.push({
            name: realName,
            type: field.type
        });
        fields.push({
            name: realName + '.keyword',
            type: 'keyword'
        });
    } else if (field.properties) {
        for (let key in field.properties) {
            buildField(key, field.properties[key], fields, realName);
        }
    } else {
        fields.push({
            name: realName,
            type: field.type
        });
    }
}