<template>
    <div class="card">
        <div
            class="title"
            v-bind:style="{
                color: index?.state === 'open' ? '#000000' : '#888888',
            }"
        >{{ index?.name }}</div>
        <div class="detail">
            <div>
                size:
                {{ index?.size }}
            </div>
            <div>docs: {{ index?.doc_count }}</div>
        </div>
        <div class="option">
            <el-dropdown @command="info">
                <el-button type="primary" size="small">
                    {{$t('home.index.info.self')}}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="state">{{$t('home.index.info.index_status')}}</el-dropdown-item>
                        <el-dropdown-item command="cluster_stats">{{$t('home.index.info.index_info')}}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-dropdown style="margin-left: 10px">
                <el-button type="primary" size="small">
                    <span>{{$t('home.index.active.self')}}</span>
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>{{$t('home.index.active.new_alias')}}</el-dropdown-item>
                        <el-dropdown-item>{{$t('home.index.active.refresh')}}</el-dropdown-item>
                        <el-dropdown-item>{{$t('home.index.active.flush_refresh')}}</el-dropdown-item>
                        <el-dropdown-item disabled>{{$t('home.index.active.ForceMerge')}}</el-dropdown-item>
                        <el-dropdown-item disabled>{{$t('home.index.active.gateway_snapshot')}}</el-dropdown-item>
                        <el-dropdown-item disabled>{{$t('home.index.active.test_profiler')}}</el-dropdown-item>
                        <el-dropdown-item v-if="index?.state === 'open'">{{$t('home.index.active.close')}}</el-dropdown-item>
                        <el-dropdown-item v-if="index?.state === 'close'">{{$t('home.index.active.open')}}</el-dropdown-item>
                        <el-dropdown-item>{{$t('home.index.active.delete')}}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <div class="alias">
            <el-tag
                v-for="(item, idx) in index?.alias"
                :key="idx"
                closable
                style="margin-right: 5px"
            >{{ item }}</el-tag>
        </div>
        <div class="expand_btn">
            <el-button type="text" @click="show_expand = !show_expand">
                <el-icon v-if="show_expand">
                    <arrow-up></arrow-up>
                </el-icon>
                <el-icon v-else>
                    <ArrowDown></ArrowDown>
                </el-icon>
            </el-button>
        </div>
        <div class="expand" v-show="show_expand">
            <div v-for="(value, key) in index?.shard" :key="key">
                <div
                    class="shard"
                    v-for="(item, idx) in value"
                    :key="idx"
                    @click="showShardOrReplica(item, idx)"
                >{{ key }}</div>
            </div>
            <div v-for="(value, key) in index?.replica" :key="key">
                <div
                    class="replica"
                    v-for="(item, idx) in value"
                    :key="idx"
                    @click="showShardOrReplica(item, idx)"
                >{{ key }}</div>
            </div>
        </div>
    </div>
    <json-dialog :title="title" :json="json" :open="open" v-model="show_dialog"></json-dialog>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import { ElMessage } from "element-plus";
import { Index } from "@/view/Index";
import JsonDialog from "@/component/JsonDialog.vue";

export default defineComponent({
    components: { ArrowDown, ArrowUp, JsonDialog },
    props: {
        index: Object as PropType<Index>
    },
    data: () => ({
        state: false,
        show_expand: false,
        title: '',
        open: true,
        json: {},
        show_dialog: false
    }),
    methods: {
        showShardOrReplica(json: any, idx: number) {
            this.title = `${this.index?.name}/${json.allocation_id ? json.allocation_id.id : 'null'}[${idx}]`;
            this.json = json;
            this.show_dialog = true;
        },
        info(command: string) {
            if (command === 'state') {
                this.title = this.index?.name!;
                this.json = this.index?.stats!;
                console.log(this.json)
                this.show_dialog = true;
            } else if (command === 'cluster_stats') {
                this.title = this.index?.name!;
                this.json = this.index?.cluster_stats!;
                this.show_dialog = true;
            } else {
                ElMessage.error('信息：命令不存在')
            }
        },
    }
});
</script>
<style lang="less">
.home-main {
    .card {
        margin: 5px;
        padding: 10px;
        border: #e3e6ec solid 1px;
        border-radius: 5px;
        position: relative;
        min-width: 700px;

        .title {
            font-size: 24px;
            font-weight: bold;
        }

        .detail {
            margin-top: 10px;
        }

        .option {
            position: absolute;
            top: 28px;
            right: 12px;
        }

        .alias {
            position: absolute;
            top: 28px;
            right: 212px;
        }

        .expand_btn {
            position: absolute;
            top: 63px;
            right: 12px;
        }

        .expand {
            margin-top: 10px;
            display: flex;
            .shard {
                border: #000000 solid 4px;
                background-color: aquamarine;
                width: 40px;
                height: 40px;
                text-align: center;
                line-height: 40px;
                margin: 4px;
                cursor: pointer;
            }
            .replica {
                border: #666666 solid 4px;
                background-color: #f2f2f2;
                width: 40px;
                height: 40px;
                text-align: center;
                line-height: 40px;
                margin: 4px;
                cursor: pointer;
            }
        }
    }
}
</style>