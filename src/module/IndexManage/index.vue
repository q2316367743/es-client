<template>
    <el-drawer :title="index" v-model="drawer" size="60%" class="index-manage" append-to-body destroy-on-close>
        <el-tabs v-model="active" class="tab">
            <el-tab-pane label="总览" name="1"/>
            <el-tab-pane label="设置" name="2"/>
            <el-tab-pane label="映射" name="3"/>
            <el-tab-pane label="统计信息" name="4"/>
        </el-tabs>
        <div class="content" v-loading="loading">
            <el-scrollbar>
                <json-view v-if="jsonViewShow" :data="data"/>
                <index-manage-summary ref="indexManageSummary" v-else :index="index" :state="state"/>
            </el-scrollbar>
        </div>
        <div class="footer">
            <el-dropdown trigger="click" @command="indexManage">
                <el-button type="primary">
                    管理
                    <el-icon class="el-icon--right">
                        <arrow-up/>
                    </el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="open" v-if="state === 'close'">打开索引
                        </el-dropdown-item>
                        <el-dropdown-item command="close" v-else-if="state === 'open'">关闭索引
                        </el-dropdown-item>
                        <el-dropdown-item disabled command="merge">强制合并索引</el-dropdown-item>
                        <el-dropdown-item command="refresh">刷新索引</el-dropdown-item>
                        <el-dropdown-item command="clear">清除索引缓存</el-dropdown-item>
                        <el-dropdown-item command="flush">flush索引</el-dropdown-item>
                        <el-dropdown-item disabled command="freeze">冻结索引</el-dropdown-item>
                        <el-dropdown-item command="remove">删除索引</el-dropdown-item>
                        <el-dropdown-item disabled command="lifecycle">增加生命周期</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </el-drawer>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {ArrowUp} from "@element-plus/icons-vue";
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
import {ElMessageBox} from "element-plus";
import {useIndexManageEvent} from "@/global/BeanFactory";

export default defineComponent({
    name: 'index-manage',
    emits: ['update:modelValue'],
    components: {IndexManageSummary, JsonView, ArrowUp},
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
                        ElMessageBox.confirm("此操作将永久删除该索引, 是否继续?", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning",
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
        top: 50px;
        left: 20px;
        right: 20px;
    }

    .content {
        position: absolute;
        top: 90px;
        left: 20px;
        right: 20px;
        bottom: 52px;
    }

    .footer {
        position: absolute;
        left: 40px;
        right: 20px;
        bottom: 12px;
    }
}
</style>