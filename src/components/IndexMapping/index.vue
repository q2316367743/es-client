<template>
    <a-spin :loading="loading" tip="渲染中" class="index-mapping">
        <a-tabs v-model:active-key="activeKey" :hide-content="true" v-if="hasType">
            <a-tab-pane v-for="(item, index) in dataItems" :title="item.type === '' ? '默认类型' : item.type"
                        :key="index">
            </a-tab-pane>
        </a-tabs>
        <!-- 可视化面板 -->
        <div class="index-mapping-tab" v-for="(_item, index) in dataItems" v-show="index === activeKey"
             :style="{height: hasType ? 'calc(100% - 50px)' : '100%'}">
            <div class="index-mapping-main">
                <a-tag bordered color="blue">type</a-tag>
                <a-input v-model="dataItems[index].type" style="width: 200px;" size="mini"
                         :disabled="!hasType"/>
                <a-tag bordered color="blue">dynamic</a-tag>
                <a-select v-model="dataItems[index].dynamic" style="width: 200px;" size="mini"
                          :disabled="!hasType">
                    <a-option label="动态模式" value="true"/>
                    <a-option label="静态模式" value="false"/>
                    <a-option label="严格模式" value="strict"/>
                </a-select>
            </div>
            <div class="index-mapping-mapper"
                 :style="{height: '100%', overflow: overflow?'hidden':'auto'}">
                <a-tree v-model:expanded-keys="expandedKeys" :data="dataItems[index].nodes" block-node show-line
                        auto-expand-parent :ref="'indexManageTree' + index">
                    <template #title="nodeData">
                        <div class="index-mapping-mapper-node">
                            <a-tag bordered :color="typeColor(nodeData.type)">{{ typeRender(nodeData.type) }}</a-tag>
                            <a-auto-complete :data="typeAutoData" size="mini" :disabled="nodeData.key === 'root'"
                                             allow-clear v-model="nodeData.type"/>
                            <a-auto-complete :data="valueTips" size="mini" :disabled="!allowEdit(nodeData.type)"
                                             v-model="nodeData.value" style="margin-left: 16px;"
                                             @search="valueTipsBuild(nodeData.type)"/>
                        </div>
                    </template>
                    <template #extra="nodeData">
                        <div class="index-mapping-mapper-option">
                            <a-button type="text" status="danger" :disabled="nodeData.key === 'root'"
                                      @click="() => removeChildNode(nodeData)">
                                <template #icon>
                                    <icon-close/>
                                </template>
                            </a-button>
                            <a-button type="text" status="normal" :disabled="!allowAdd(nodeData.type)"
                                      @click="() => addChildNode(nodeData)">
                                <template #icon>
                                    <icon-plus/>
                                </template>
                            </a-button>
                        </div>
                    </template>
                </a-tree>
            </div>
        </div>
        <!-- 结果展示 -->
        <div class="index-mapping-source" v-if="source.show">
            <json-view :data="source.data" :copy="false"/>
        </div>
        <a-button type="text" status="normal" class="index-mapping-switch" @click="source.show = !source.show">切换
        </a-button>
        <a-back-top target-container=".index-mapping-mapper"/>
    </a-spin>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {SelectOptionData,} from "@arco-design/web-vue";

import './index.less';

import MappingNode from "@/components/IndexMapping/domain/MappingNode";
import {allowEditTypes, typeAutoData} from "@/components/IndexMapping/Constant";
import {
    mappingBuild,
    removeTreeNode, typeColor,
    typeRender,
    valueTipsBuild
} from "@/components/IndexMapping/Util";
import {Mapping, Property} from "@/components/es/domain/IndexBase";
import JsonView from "@/components/view/JsonView/index.vue";
import MappingData from "./domain/MappingData";


export default defineComponent({
    name: 'index-mapping',
    components: {JsonView},
    props: {
        overflow: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data: () => {
        let dataItems = new Array<MappingData>();
        dataItems.push({
            type: '',
            dynamic: '',
            nodes: [{
                disabled: true,
                key: 'root',
                type: 'root',
                value: '',
                children: new Array<MappingNode>()
            }]
        });
        return {
            dataItems,
            activeKey: 0,
            expandedKeys: new Array<string>(),
            typeAutoData: markRaw(typeAutoData),
            source: {
                show: true,
                data: {} as any
            },
            loading: false,
            hasType: true,
            valueTips: new Array<SelectOptionData>()
        }
    },
    mounted() {
        this.dataItems = [{
            type: '',
            dynamic: '',
            nodes: [{
                disabled: true,
                key: 'root',
                type: 'root',
                value: '',
                children: new Array<MappingNode>()
            }]
        }];
        this.source.data = {};
    },
    methods: {
        typeRender,
        typeColor,
        valueTipsBuild(keyword: string) {
            this.valueTips = valueTipsBuild(keyword);
        },
        addChildNode(node: MappingNode) {
            let time = new Date().getTime();
            node.children?.push({
                key: time + '',
                type: '',
                value: '',
                children: new Array<MappingNode>()
            });
            if (!this.expandedKeys.includes(node.key)) {
                this.expandedKeys.push(node.key);
            }
        },
        removeChildNode(node: MappingNode) {
            removeTreeNode(node.key, this.dataItems[this.activeKey].nodes);
        },
        allowEdit(type: string): boolean {
            return allowEditTypes.includes(type);
        },
        allowAdd(type: string): boolean {
            return !allowEditTypes.includes(type);
        },
        getMapping(): Record<string, Mapping> | Property {
            return mappingBuild(this.dataItems)
        }
    }
});
</script>
<style lang="less">
</style>
