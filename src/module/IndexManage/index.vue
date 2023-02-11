<template>
    <a-drawer :title="index" v-model:visible="drawer" width="60%" class="index-manage" render-to-body unmount-on-close>
        <a-tabs v-model:active-key="active" class="tab">
            <a-tab-pane title="总览" key="1"/>
            <a-tab-pane title="设置" key="2"/>
            <a-tab-pane title="映射" key="3"/>
            <a-tab-pane title="统计信息" key="4"/>
        </a-tabs>
        <a-spin :loading="loading" tip="加载中">
            <div class="content">
                <a-scrollbar>
                    <json-view v-if="jsonViewShow" :data="data"/>
                    <index-manage-summary ref="indexManageSummary" v-else :index="index" :state="state"/>
                </a-scrollbar>
            </div>
        </a-spin>
        <template #footer>
            <a-dropdown trigger="click" @command="indexManage">
                <a-button type="primary">
                    管理
                    <icon-up/>
                </a-button>
                <template #content>
                    <a-doption value="open" v-if="state === 'close'">打开索引</a-doption>
                    <a-doption value="close" v-else-if="state === 'open'">关闭索引</a-doption>
                    <a-doption disabled value="merge">强制合并索引</a-doption>
                    <a-doption value="refresh">刷新索引</a-doption>
                    <a-doption value="clear">清除索引缓存</a-doption>
                    <a-doption value="flush">flush索引</a-doption>
                    <a-doption disabled value="freeze">冻结索引</a-doption>
                    <a-doption value="remove">删除索引</a-doption>
                    <a-doption disabled value="lifecycle">增加生命周期</a-doption>
                </template>
            </a-dropdown>
        </template>
    </a-drawer>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import JsonView from "@/components/JsonView/index.vue";
import ArrayUtil from "@/utils/ArrayUtil";
import IndexApi from "@/api/IndexApi";
import Assert from "@/utils/Assert";
import IndexManageSummary from "@/module/IndexManage/summary.vue";
import MessageUtil from "@/utils/MessageUtil";
import emitter from "@/plugins/mitt";
import MessageEventEnum from "@/enumeration/MessageEventEnum";
import useIndexStore from "@/store/IndexStore";
import Optional from "@/utils/Optional";
import {mapState} from "pinia";
import {useIndexManageEvent} from "@/global/BeanFactory";
import MessageBoxUtil from "@/utils/MessageBoxUtil";

export default defineComponent({
    name: 'index-manage',
    emits: ['update:modelValue'],
    components: {IndexManageSummary, JsonView},
    data: () => ({
        drawer: false,
        active: '1',
        data: {},
        loading: false,
        index: ''
    }),
    watch: {
        active(newValue: string) {
            this.assignJson(newValue);
        }
    },
    computed: {
        jsonViewShow() {
            return ArrayUtil.contains(['2', '3', '4'], this.active);
        },
        ...mapState(useIndexStore, ['indicesMap']),
        state() {
            let indexView = useIndexStore().indicesMap.get(this.index);
            return Optional.ofNullable(indexView).map(e => e.state).orElse('');
        }
    },
    created() {
        useIndexManageEvent.on(index => {
            this.drawer = true;
            this.index = index;
            this.active = '1';
        })
    },
    methods: {
        assignJson(newValue: string) {
            switch (newValue) {
                case '2':
                    this.setting();
                    break;
                case '3':
                    this.mapping();
                    break;
                case '4':
                    this.stats();
                    break;
            }
        },
        setting() {
            Assert.notNull(this.index, "索引名称不存在");
            this.loading = true;
            IndexApi(this.index)._settings().then(result => {
                this.data = result[this.index];
            }).catch(e => {
                MessageUtil.error('索引设置查询错误', e);
                this.data = {};
            }).finally(() => {
                this.loading = false;
            })
        },
        mapping() {
            Assert.notNull(this.index, "索引名称不存在");
            this.loading = true;
            IndexApi(this.index)._mappings().then(result => {
                this.data = result[this.index!];
            }).catch(e => {
                MessageUtil.error('索引映射查询错误', e);
                this.data = {};
            }).finally(() => {
                this.loading = false;
            })
        },
        stats() {
            Assert.notNull(this.index, "索引名称不存在");
            this.loading = true;
            IndexApi(this.index)._stats().then(result => {
                this.data = result;
            }).catch(e => {
                MessageUtil.error('索引状态查询错误', e);
                this.data = {};
            }).finally(() => {
                this.loading = false;
            })
        },
        indexManage(command: string) {
            this.execCommand(command).then(() => {
                // 1. 发送索引更新事件
                emitter.emit(MessageEventEnum.REFRESH_URL);
                // 2. 更新状态
                this.state = command === 'open' ? 'open' : command === 'close' ? 'close' : this.state;
                // 3. 更新本组件
                this.assignJson(this.active);
            }).catch(e => console.error(e));
        },
        execCommand(command: string): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                switch (command) {
                    case 'open':
                        IndexApi(this.index)._open()
                            .then(res => MessageUtil.success(res, resolve))
                            .catch(e => MessageUtil.error('打开索引错误', e, () => reject(e)));
                        break;
                    case 'close':
                        IndexApi(this.index)._close()
                            .then(res => MessageUtil.success(res, resolve))
                            .catch(e => MessageUtil.error('关闭索引错误', e, () => reject(e)));
                        break;
                    case 'merge':
                        break;
                    case 'refresh':
                        IndexApi(this.index)._refresh()
                            .then(res => MessageUtil.success(res, resolve))
                            .catch(e => MessageUtil.error('刷新索引失败', e, () => reject(e)));
                        break;
                    case 'clear':
                        IndexApi(this.index)._cacheClear()
                            .then(res => MessageUtil.success(res, resolve))
                            .catch(e => MessageUtil.error('清理缓存失败', e, () => reject(e)));
                        break;
                    case 'flush':
                        IndexApi(this.index)._flush()
                            .then(res => MessageUtil.success(res, resolve))
                            .catch(e => MessageUtil.error('flush刷新失败', e, () => reject(e)));
                        break;
                    case 'freeze':
                        break;
                    case 'remove':
                        MessageBoxUtil.confirm("此操作将永久删除该索引, 是否继续?", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消"
                        }).then(() => IndexApi(this.index).delete()
                            .then(res => MessageUtil.success(res, resolve))
                            .catch(e => MessageUtil.error('索引删除错误', e, () => reject(e))));
                        break;
                    case 'lifecycle':
                        break;
                }
            })
        }
    }
});
</script>
<style lang="less">
.index-manage {
    .tab {
        position: absolute;
        top: 10px;
        left: 20px;
        right: 20px;
    }

    .content {
        position: absolute;
        top: 40px;
        left: 20px;
        right: 20px;
        bottom: 52px;
    }

    .arco-drawer-footer {
        text-align: left !important;
    }
}
</style>