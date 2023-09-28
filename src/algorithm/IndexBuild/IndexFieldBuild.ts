import Field from "@/view/Field";
import {Mapping, Property} from "@/components/es/domain/IndexBase";

// 默认类型
const DEFAULT_TYPES: Array<string> = ['_doc', 'doc'];

/**
 * 索引字段映射
 * @param mappings 映射
 * @returns  字段
 */
export default function IndexFieldBuild(mappings: Record<string, Mapping>): Array<Field> {
    let fields = new Array<Field>();

    // 全部类型
    const types = Object.keys(mappings);

    // 单类型
    if (types.length === 1 && (types[0] === DEFAULT_TYPES[0] || types[1] === DEFAULT_TYPES[1])) {

        // 只有一个类型，并且还是默认类型
        const mapping = mappings[DEFAULT_TYPES[0]] || mappings[DEFAULT_TYPES[1]];
        const properties = mapping.properties;
        let prefix = '';
        if (properties) {
            for (let key in properties) {
                buildField(key, properties[key], fields, prefix, "");
            }
        }
        return fields;

    }

    // 多类型
    for (let type of types) {
        const mapping = mappings[type];
        const properties = mapping.properties;
        let prefix = '';
        if (properties) {
            for (let key in properties) {
                buildField(key, properties[key], fields, prefix, type)
            }
        }
    }

    return fields;
}

function buildField(name: string, field: Property, fields: Array<Field>, prefix: string, _type: string): void {
    let realName = name;
    let dataIndex = name;
    if (prefix !== '') {
        realName = prefix + '.' + name;
        dataIndex = prefix + '-' + name;
    }
    if (field.fields) {
        // 如果存在`fields`字段，则代表这个字段是`text`类型+`keyword`类型
        fields.push({
            name: realName,
            type: field.type || '',
            dataIndex,
            label: _type ? _type + '.' + realName : realName
        });
        const keywordName = realName + '.keyword';
        fields.push({
            name: keywordName,
            type: 'keyword',
            dataIndex: '',
            label: _type ? _type + '.' + keywordName : keywordName
        });
    } else if (field.properties) {
        for (let key in field.properties) {
            buildField(key, field.properties[key], fields, realName, _type);
        }
    } else {
        fields.push({
            name: realName,
            type: field.type || '',
            dataIndex,
            label: _type ? _type + '.' + realName : realName
        });
    }
}
