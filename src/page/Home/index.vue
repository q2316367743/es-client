<template>
    <div class="home">
        <!-- 上面的搜索条件 -->
        <div class="home-option">
            <div style="display: flex">
                <!-- 输入框 -->
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
            <el-button type="primary" style="margin-left: 10px" @click="indexAddDialog = true" :disabled="!url">{{
                    $t('home.new_index.self')
                }}
            </el-button>
        </div>
        <!-- 索引容器 -->
        <div class="home-container" ref="homeContainer">
            <vxe-list v-loading="indexLoading" :data="showIndices" :auto-resize="true" :height="height"
                      v-if="showIndices.length > 0">
                <template #default="{ items }">
                    <index-item v-for="item in items" :index="item" @open-dialog="indexOpenDialog"/>
                </template>
            </vxe-list>
        </div>
        <!-- 新增索引 -->
        <home-index-add v-model="indexAddDialog"/>
        <json-dialog :title="indexItem.title" :json="indexItem.data" :open="true" v-model="indexItem.dialog"/>
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

import useUrlStore from '@/store/UrlStore';
import useIndexStore from '@/store/IndexStore';

import IndexView from "@/view/index/IndexView";

import IndexItem from "./components/IndexItem.vue";
import JsonDialog from "@/components/JsonDialog.vue";

import mitt from '@/plugins/mitt';
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import {stringContain} from "@/utils/SearchUtil";

import HomeIndexAdd from "@/page/Home/components/IndexAdd.vue";
import {useElementSize} from "@vueuse/core";

let lastSearchTime = 0;
let lastExecuteId = -1;

export default defineComponent({
    name: 'Home',
    components: {HomeIndexAdd, IndexItem, JsonDialog},
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
                state: 0
            },
            // 列表加载中
            indexLoading: false,
            // 索引的详情对话框
            indexItem: {
                dialog: false,
                title: '',
                data: {} as any,
            },
            showTop: true,
            indexAddDialog: false,
            // 高度
            height: undefined as any,
        };
    },
    computed: {
        ...mapState(useUrlStore, ['url']),
        ...mapState(useIndexStore, ['indices']),
    },
    created() {
        mitt.on(MessageEventEnum.URL_REFRESH, () => {
            this.indexItem = {
                dialog: false,
                title: '',
                data: {} as any,
            };
            this.search();
        });
        mitt.on(MessageEventEnum.URL_UPDATE, () => {
            // 重置查询条件
            this.condition = {
                dialog: false,
                name: "",
                order: "NAME_ASC",
                state: 0
            }
            // 重置页面
            this.indexItem = {
                dialog: false,
                title: '',
                data: {} as any,
            };
            this.search();
        });
    },
    mounted() {
        let homeContainer = this.$refs['homeContainer'] as HTMLDivElement;
        const {height} = useElementSize(homeContainer);
        this.height = height;
    },
    methods: {
        /**
         * 基于当前索引数组进行过滤
         */
        search() {
            let now = new Date().getTime();
            console.log('search - ready');
            if (now - lastSearchTime < 500) {
                // 限流500ms
                clearTimeout(lastExecuteId);
                lastExecuteId = setTimeout(() => this.executeSearch(), 500) as unknown as number;
            } else {
                lastExecuteId = setTimeout(() => this.executeSearch(), 500) as unknown as number;
            }
            lastSearchTime = now;
        },
        executeSearch() {
            console.log('search - execute');
            this.indexLoading = true;
            let showIndices = this.indices;
            if (this.condition.name !== '') {
                showIndices = showIndices.filter((item) => {
                    return stringContain(item.name, this.condition.name);
                });
            }
            if (this.condition.state > 0) {
                showIndices = showIndices.filter(e =>
                    (this.condition.state === 1 && e.state === 'open') ||
                    (this.condition.state === 2 && e.state === 'close'));
            }
            // 排序
            switch (this.condition.order) {
                case "NAME_ASC":
                    showIndices = showIndices.sort((a, b) => {
                        return a.name.localeCompare(b.name, "zh-CN");
                    });
                    break;
                case "NAME_DESC":
                    showIndices = showIndices.sort((a, b) => {
                        return b.name.localeCompare(a.name, "zh-CN");
                    });
                    break;
                case "SIZE_ASC":
                    showIndices = showIndices.sort((a, b) => {
                        return a.original_size - b.original_size;
                    });
                    break;
                case "SIZE_DESC":
                    showIndices = showIndices.sort((a, b) => {
                        return b.original_size - a.original_size;
                    });
                    break;
                case "DOC_ASC":
                    showIndices = showIndices.sort((a, b) => {
                        return a.doc_count - b.doc_count;
                    });
                    break;
                case "DOC_DESC":
                    showIndices = showIndices.sort((a, b) => {
                        return b.doc_count - a.doc_count;
                    });
                    break;
            }
            this.indexLoading = false;
            this.$nextTick(() => {
                this.showIndices = showIndices;
            })
        },
        indexOpenDialog(title: string, content: any) {
            this.indexItem = {
                dialog: true,
                title,
                data: content,
            }
        },
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

    .home-container {
        position: absolute;
        top: 45px;
        left: 0;
        right: 5px;
        bottom: 5px;
    }
}
</style>