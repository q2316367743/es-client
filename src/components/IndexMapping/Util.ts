import MappingNode from "@/components/IndexMapping/domain/MappingNode";
import {Mapping, Property} from "@/es/IndexBase";
import MappingData from "@/components/IndexMapping/domain/MappingData";
import Optional from "@/utils/Optional";
import {typeMap} from "@/components/IndexMapping/Constant";

function generateKey(): string {
    return (Math.round(Math.random() * 1000) + new Date().getTime()) + ''
}

export function removeTreeNode(key: string, nodes: Array<MappingNode>) {
    for (let node of nodes) {
        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i];
            if (child.key === key) {
                node.children.splice(i, 1);
                return;
            }
        }
        removeTreeNode(key, node.children);
    }
}

export function typeRender(type: string): string {
    if (type === 'root') {
        return 'properties';
    }
    return Optional.ofNullable(typeMap[type]).orElse('属性');
}

export function mappingNodeBuild(mapping: Record<string, Mapping>): Array<MappingData> {
    let mappingDataItems = new Array<MappingData>();
    for (let mappingKey in mapping) {
        let item = mapping[mappingKey]
        let data = {
            type: mappingKey,
            dynamic: item.dynamic,
            nodes: [{
                disabled: true,
                key: 'root',
                type: 'root',
                value: '',
                children: new Array<MappingNode>()
            }] as Array<MappingNode>
        } as MappingData
        for (let key in item.properties) {
            nodeBuild(key, item.properties[key], data.nodes[0].children);
        }
        mappingDataItems.push(data);
    }
    return mappingDataItems;
}

function nodeBuild(key: string, property: Property, nodes: Array<MappingNode>) {
    let node = {
        key: generateKey(),
        type: key,
        value: '',
        children: new Array<MappingNode>()
    } as MappingNode;
    if (property.properties) {
        for (let propertiesKey in property.properties) {
            nodeBuild(propertiesKey, property.properties[propertiesKey], node.children);
        }
    }
    if (property.fields) {
        let field = {
            key: generateKey(),
            type: 'fields',
            value: '',
            children: new Array<MappingNode>()
        } as MappingNode;
        // 字段处理
        if (property.fields.keyword) {
            field.children.push({
                key: generateKey(),
                type: 'keyword',
                value: '',
                children: [{
                    key: generateKey(),
                    type: 'type',
                    value: property.fields.keyword.type,
                    children: new Array<MappingNode>()
                }, {
                    key: generateKey(),
                    type: 'ignore_above',
                    value: property.fields.keyword.ignore_above,
                    children: new Array<MappingNode>()
                }] as Array<MappingNode>
            })
        }
        node.children.push(field);
    }
    for (let propertyKey in property) {
        if (propertyKey === 'fields' || propertyKey === 'properties') {
            continue;
        }
        node.children.push({
            key: generateKey(),
            type: propertyKey,
            // @ts-ignore
            value: property[propertyKey] + '',
            children: new Array<MappingNode>()
        });
    }
    nodes.push(node);
}