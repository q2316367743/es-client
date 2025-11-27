import MappingNode from "@/components/IndexMapping/domain/MappingNode";
import {Mapping, Property} from "@/domain/es/IndexBase";
import MappingData from "@/components/IndexMapping/domain/MappingData";
import Optional from "@/utils/Optional";
import {typeMap} from "@/components/IndexMapping/Constant";
import {versionStrategyContext} from "@/global/BeanFactory";
import {allowEditTypes} from "./Constant";
import {SelectOptionData} from "@arco-design/web-vue";

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

export function typeColor(type: string): string {
  if (typeMap[type]) {
    if (type === 'type') {
      return 'purple';
    } else {
      return 'blue';
    }
  } else {
    return 'green';
  }
}

export function mappingNodeBuild(mapping: Record<string, Mapping>): Array<MappingData> {
  let mappingDataItems = new Array<MappingData>();
  if (versionStrategyContext.getStrategy().hasType()) {
    for (let mappingKey in mapping) {
      let item = mapping[mappingKey]
      typeBuild(mappingKey, item, mappingDataItems);
    }
  } else {
    typeBuild('', mapping, mappingDataItems);
  }
  return mappingDataItems;
}

function typeBuild(key: string, mapping: Mapping, mappingDataItems: Array<MappingData>) {
  let data = {
    type: key,
    dynamic: Optional.ofNullable(mapping).map(e => e.dynamic).orElse(""),
    nodes: [{
      disabled: true,
      key: 'root',
      type: 'root',
      value: '',
      children: new Array<MappingNode>()
    }] as Array<MappingNode>
  } as MappingData
  for (let key in Optional.ofNullable(mapping).map(e => e.properties).orElse({})) {
    // @ts-ignore
    nodeBuild(key, mapping.properties[key], data.nodes[0].children);
  }
  mappingDataItems.push(data);
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
          value: property.fields.keyword.ignore_above + '',
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

export function mappingBuild(data: Array<MappingData>): Record<string, Mapping> | Record<string, Property> {
  if (versionStrategyContext.getStrategy().hasType()) {
    let result = {} as Record<string, Mapping>;
    for (let datum of data) {
      let item = {
        properties: {},
        dynamic: datum.dynamic
      };
      propertiesBuild(datum.nodes[0].children, item.properties)
      result[datum.type] = item;
    }
    return result
  } else {
    if (data.length === 0) {
      return {};
    }
    let item = {} as Record<string, Property>
    propertiesBuild(data[0].nodes[0].children, item);
    return item;
  }
}

function propertiesBuild(nodes: Array<MappingNode>, properties: Property) {
  let result = {} as Record<string, Property>;
  for (let node of nodes) {
    console.log(node)
    if (allowEditTypes.includes(node.type)) {
      //@ts-ignore
      properties[node.type] = node.value;
    } else {
      let ii = {} as Record<string, Property>;
      ii[node.type] = {}
      propertiesBuild(node.children, ii[node.type]);
      if (properties['properties']) {
        properties['properties'][node.type] = ii[node.type];
      } else {
        properties['properties'] = ii;
      }
    }
  }
  return result;
}

/**
 * 值提示构建
 *
 * @param type 类型
 */
export function valueTipsBuild(type: string): Array<SelectOptionData> {
  return tipsBuild(type).map(e => ({
    label: e,
    value: e
  }));
}

function tipsBuild(type: string): Array<string> {
  switch (type) {
    case 'dynamic':
      return ['true', 'false', 'strict'];
    case 'enabled':
    case 'fielddata':
    case 'ignore_malformed':
    case 'include_in_all':
    case 'norms':
    case 'store':
      return ['true', 'false'];
    case 'format':
      return ['yyyy-MM-dd', 'yyyy-MM-dd HH:mm:ss', 'HH:mm:ss', 'epoch_millis'];
    case 'index_options':
      return ['docs', 'freqs', 'positions', 'offsets']
    case 'index':
      return ['analyzed', 'not_analyzed']
    case 'similarity':
      return ['classic', 'BM25'];
    case 'term_vector':
      return ['no', 'yes', 'with_positions', 'with_offset', 'with_positions_offsets'];
    case 'type':
      return ['text', 'keyword', 'long', 'integer', 'short', 'byte', 'double', 'float', 'half_float', 'scaled_float',
        'date', 'boolean', 'binary', 'Array', 'object', 'nested', 'geo_shape']
    default:
      return [];
  }
}
