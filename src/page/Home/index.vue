<template>
    <div class="home">
        <!-- 上面的搜索条件 -->
        <div class="home-option">
            <div style="display: flex">
                <el-input v-model="condition.name" :placeholder="$t('home.index_placeholder')"
                          style="width: 300px;height: 32px;" @input="search" clearable></el-input>
                <el-select v-model="condition.order" :placeholder="$t('home.order_placeholder')"
                           style="margin-left: 5px" clearable @change="search">
                    <el-option :label="$t('home.order_name_asc')" value="NAME_ASC"></el-option>
                    <el-option :label="$t('home.order_name_desc')" value="NAME_DESC"></el-option>
                    <el-option :label="$t('home.order_size_asc')" value="SIZE_ASC"></el-option>
                    <el-option :label="$t('home.order_size_desc')" value="SIZE_DESC"></el-option>
                    <el-option :label="$t('home.order_doc_asc')" value="DOC_ASC"></el-option>
                    <el-option :label="$t('home.order_doc_desc')" value="DOC_DESC"></el-option>
                </el-select>
                <el-button style="margin-left: 5px" @click="condition.dialog = true">更多</el-button>
                <el-button type="primary" style="margin-left: 5px" @click="search">{{ $t('home.search') }}</el-button>
            </div>
            <el-button type="primary" style="margin-left: 10px" @click="indexDialog = true">{{
                    $t('home.new_index.self')
                }}
            </el-button>
        </div>
        <!-- 索引容器 -->
        <index-container :indices="showIndices" v-loading="indexLoading" @open-dialog="index_open_dialog"/>
        <!-- 返回顶部 -->
        <el-backtop :right="40" :bottom="60" target=".index-container"/>
        <!-- 新增索引 -->
        <el-dialog :title="$t('home.new_index.self')" v-model="indexDialog" width="850px">
            <el-form>
                <el-form-item :label="$t('home.new_index.name')">
                    <el-input v-model="index.name" style="width: 300px;"></el-input>
                </el-form-item>
            </el-form>
            <el-collapse v-model="indexCollapse">
                <el-collapse-item :title="$t('home.new_index.base_setting')" name="1">
                    <el-form>
                        <el-form-item :label="$t('home.new_index.shard_number')">
                            <el-input-number v-model="index.settings.numberOfShards" controls-position="right">
                            </el-input-number>
                        </el-form-item>
                        <el-form-item :label="$t('home.new_index.replica_number')">
                            <el-input-number v-model="index.settings.numberOfReplicas" controls-position="right">
                            </el-input-number>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item :title="$t('home.new_index.field_setting')" name="2">
                    <div v-if="index.mapping.length === 0">
                        <el-button type="primary" @click="addProperty">{{ $t('home.new_index.add') }}</el-button>
                    </div>
                    <el-form v-else>
                        <div v-for="(property, idx) in index.mapping" :key="idx">
                            <el-form :inline="true">
                                <el-form-item :label="$t('home.new_index.field_name')">
                                    <el-input v-model="property.field"></el-input>
                                </el-form-item>
                                <el-form-item :label="$t('home.new_index.field_type')">
                                    <el-select v-model="property.type">
                                        <el-option v-for="(type) in types" :key="type" :label="type" :value="type">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="addProperty">{{ $t('home.new_index.add') }}
                                    </el-button>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="danger" @click="removeProperty(property)">{{
                                            $t('home.new_index.delete')
                                        }}
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-form>
                </el-collapse-item>
            </el-collapse>
            <template #footer>
                <el-button type="info" text @click="copyIndex">复制到剪切板</el-button>
                <el-button type="primary" @click="addIndex">{{ $t('home.new_index.add') }}</el-button>
            </template>
        </el-dialog>
        <json-dialog :title="indexItemTitle" :json="indexItemData" :open="true" v-model="indexItemDialog"/>
        <!-- 更多查询条件 -->
        <el-dialog v-model="condition.dialog" destroy-on-close append-to-body title="更多查询条件">
            <el-form v-model="condition" label-width="80px" label-position="left">
                <el-form-item label="状态">
                    <el-radio-group v-model="condition.state">
                        <el-radio :label="0">忽略</el-radio>
                        <el-radio :label="1">开启</el-radio>
                        <el-radio :label="2">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {mapState} from 'pinia';
import {ElMessage} from 'element-plus';

import useUrlStore from '@/store/UrlStore';
import useIndexStore from '@/store/IndexStore';
import useSettingStore from '@/store/SettingStore';

import IndexView from "@/view/index/IndexView";
import {IndexInstance, Property} from '@/entity/IndexInstance';
import indexApi from '@/api/IndexApi';

import IndexItem from "./components/IndexItem.vue";
import IndexContainer from './components/IndexContainer.vue';
import JsonDialog from "@/components/JsonDialog.vue";

import mitt from '@/plugins/mitt';
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import BrowserUtil from "@/utils/BrowserUtil";
import IndexSaveBuild from "@/build/IndexSaveBuild";
import {stringContain} from "@/utils/SearchUtil";


export default defineComponent({
    name: 'Home',
    components: {IndexItem, IndexContainer, JsonDialog},
    data: () => {
        return {
            // 根据条件过滤后的索引
            showIndices: [] as Array<IndexView>,
            // 搜索条件
            condition: {
                dialog: false,
                name: "",
                order: "NAME_ASC",
                // 0不处理，1开启，2关闭
                state: useSettingStore().getHomeSearchState
            },
            // 定时器
            interval: {} as NodeJS.Timer | null,
            // 列表加载中
            indexLoading: false,
            index: {
                name: '',
                settings: {
                    numberOfReplicas: useSettingStore().getDefaultReplica,
                    numberOfShards: useSettingStore().getDefaultShard
                },
                mapping: [] as Array<Property>
            } as IndexInstance,
            indexDialog: false,
            indexCollapse: '1',
            types: ['string', 'text', 'keyword', 'integer', 'long', 'short', 'byte', 'double', 'float', 'boolean', 'date'],
            // 索引的详情对话框
            indexItemDialog: false,
            indexItemTitle: '',
            indexItemData: {} as any
        };
    },
    computed: {
        ...mapState(useUrlStore, ['url']),
        ...mapState(useIndexStore, ['indices']),
    },
    created() {
        mitt.on(MessageEventEnum.INDEX_REFRESH, () => {
            this.indexItemDialog = false;
            this.indexItemTitle = '';
            this.indexItemData = {} as any;
            this.search();
        });
        mitt.on(MessageEventEnum.INDEX_CONNECT, () => {
            // 重置查询条件
            this.condition = {
                dialog: false,
                name: "",
                order: "NAME_ASC",
                state: useSettingStore().getHomeSearchState
            }
            // 充值页面
            this.indexItemDialog = false;
            this.indexItemTitle = '';
            this.indexItemData = {} as any;
            this.search();
        });
        mitt.on(MessageEventEnum.INDEX_CLEAN, () => {
            // 重置查询条件
            this.condition = {
                dialog: false,
                name: "",
                order: "NAME_ASC",
                state: useSettingStore().getHomeSearchState
            }
            // 充值页面
            this.indexItemDialog = false;
            this.indexItemTitle = '';
            this.indexItemData = {} as any;
            this.search();
        });
    },
    methods: {
        /**
         * 基于当前索引数组进行过滤
         */
        search() {
            this.indexLoading = true;
            this.showIndices = this.indices.filter((item) => {
                return stringContain(item.name, this.condition.name);
            }).filter(e => this.condition.state === 0 ||
                (this.condition.state === 1 && e.state === 'open') ||
                (this.condition.state === 2 && e.state === 'close'));
            // 排序
            switch (this.condition.order) {
                case "NAME_ASC":
                    this.showIndices = this.showIndices.sort((a, b) => {
                        return a.name.localeCompare(b.name, "zh-CN");
                    });
                    break;
                case "NAME_DESC":
                    this.showIndices = this.showIndices.sort((a, b) => {
                        return b.name.localeCompare(a.name, "zh-CN");
                    });
                    break;
                case "SIZE_ASC":
                    this.showIndices = this.showIndices.sort((a, b) => {
                        return a.original_size - b.original_size;
                    });
                    break;
                case "SIZE_DESC":
                    this.showIndices = this.showIndices.sort((a, b) => {
                        return b.original_size - a.original_size;
                    });
                    break;
                case "DOC_ASC":
                    this.showIndices = this.showIndices.sort((a, b) => {
                        return a.doc_count - b.doc_count;
                    });
                    break;
                case "DOC_DESC":
                    this.showIndices = this.showIndices.sort((a, b) => {
                        return b.doc_count - a.doc_count;
                    });
                    break;
            }
            this.$nextTick(() => {
                this.indexLoading = false;
            })
        },
        addProperty() {
            this.index.mapping.push({id: new Date().getTime(), field: '', 'type': 'text'})
        },
        removeProperty(property: Property) {
            this.index.mapping = this.index.mapping.filter((target: Property) => {
                return property.id !== target.id;
            });
        },
        addIndex() {
            // 新增
            indexApi.save(this.index, (data: any) => {
                // 显示对话框
                ElMessage.info(JSON.stringify(data));
                // 刷新索引
                useIndexStore().reset();
            })
            // 关闭弹框
            this.indexDialog = false;
            this.$nextTick(() => {
                // 重置
                this.index = {
                    name: '',
                    settings: {
                        numberOfReplicas: useSettingStore().getDefaultReplica,
                        numberOfShards: useSettingStore().getDefaultShard
                    },
                    mapping: [] as Array<Property>
                } as IndexInstance;
            })
        },
        copyIndex() {
            BrowserUtil.copy(JSON.stringify(IndexSaveBuild(this.index), null, 4));
            // 关闭弹框
            this.indexDialog = false;
            ElMessage({
                showClose: true,
                type: "success",
                message: "成功复制到剪切板"
            });
            this.$nextTick(() => {
                // 重置
                this.index = {
                    name: '',
                    settings: {
                        numberOfReplicas: useSettingStore().getDefaultReplica,
                        numberOfShards: useSettingStore().getDefaultShard
                    },
                    mapping: [] as Array<Property>
                } as IndexInstance;
            })
        },
        index_open_dialog(title: string, content: any) {
            this.indexItemDialog = true;
            this.indexItemTitle = title;
            this.indexItemData = content;
        }
    },
});
</script>

<style lang="less">
.home {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;

    .home-option {
        position: absolute;
        top: 0;
        left: 5px;
        right: 10px;
        height: 40px;
        display: flex;
        justify-content: space-between;
    }
}
</style>