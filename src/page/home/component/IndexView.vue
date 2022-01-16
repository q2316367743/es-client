<template>
    <div class="card">
        <div
            class="title"
            v-bind:style="{
                color: state ? '#000000' : '#888888',
            }"
        >{{ index.name }}</div>
        <div class="detail">
            <div>
                size:
                {{ index?.size }}
            </div>
            <div>docs: {{ index?.doc_count }}</div>
        </div>
        <div class="option">
            <el-dropdown>
                <el-button type="primary" size="small">
                    信息
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>索引状态</el-dropdown-item>
                        <el-dropdown-item>索引信息</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-dropdown style="margin-left: 10px">
                <el-button type="primary" size="small">
                    <span>动作</span>
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>新建别名</el-dropdown-item>
                        <el-dropdown-item>刷新</el-dropdown-item>
                        <el-dropdown-item>Flush刷新</el-dropdown-item>
                        <el-dropdown-item disabled>ForceMerge</el-dropdown-item>
                        <el-dropdown-item disabled>网关快照</el-dropdown-item>
                        <el-dropdown-item disabled>测试分析器</el-dropdown-item>
                        <el-dropdown-item v-if="index.state === 'open'">关闭</el-dropdown-item>
                        <el-dropdown-item v-if="index.state === 'close'">开启</el-dropdown-item>
                        <el-dropdown-item>删除</el-dropdown-item>
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
                <i class="el-icon-arrow-up" v-if="show_expand"></i>
                <i class="el-icon-arrow-down" v-else></i>
            </el-button>
        </div>
        <div class="expand" v-show="show_expand">
            <div v-for="(value, key) in index.shard" :key="key">
                <div class="shard" v-for="(item, idx) in value" :key="idx">{{ key }}</div>
            </div>
            <div v-for="(value, key) in index.replica" :key="key">
                <div class="replica" v-for="(item, idx) in value" :key="idx">{{ key }}</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Index } from "@/view/Index";
import { defineComponent, PropType } from "vue";
import { ArrowDown } from '@element-plus/icons-vue';

export default defineComponent({
    components: { ArrowDown },
    props: {
        index: Object as PropType<Index>
    },
    data: () => ({
        state: false,
        show_expand: false
    }),
    created() {
        console.log(this.index)
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
                line-height: 32px;
                margin: 4px;
                cursor: pointer;
            }
            .replica {
                border: #666666 solid 4px;
                background-color: #f2f2f2;
                width: 40px;
                height: 40px;
                text-align: center;
                line-height: 32px;
                margin: 4px;
                cursor: pointer;
            }
        }
    }
}
</style>