<template>
    <div class="data-browse">
        <div class="browse-header">数据浏览</div>
        <div class="browse-main">
            <el-scrollbar class="browse-side" :class="show_side ? 'browse-side-open' : 'browse-side-hide'">
                <es-list>
                    <es-list-item>product1</es-list-item>
                    <es-list-item>product2</es-list-item>
                    <es-list-item>product3</es-list-item>
                    <es-list-item>product1</es-list-item>
                    <es-list-item>product2</es-list-item>
                    <es-list-item>product3</es-list-item>
                    <es-list-item>product1</es-list-item>
                    <es-list-item>product2</es-list-item>
                    <es-list-item>product3</es-list-item>
                    <es-list-item>product1</es-list-item>
                    <es-list-item>product2</es-list-item>
                    <es-list-item>product3</es-list-item>
                    <es-list-item>product1</es-list-item>
                    <es-list-item>product2</es-list-item>
                    <es-list-item>product3</es-list-item>
                    <es-list-item>product1</es-list-item>
                    <es-list-item>product2</es-list-item>
                    <es-list-item>product3</es-list-item>
                    <es-list-item>product1</es-list-item>
                    <es-list-item>product2</es-list-item>
                    <es-list-item>product3</es-list-item>
                    <es-list-item>product1</es-list-item>
                    <es-list-item>product2</es-list-item>
                    <es-list-item>product3</es-list-item>
                    <es-list-item>product1</es-list-item>
                    <es-list-item>product2</es-list-item>
                    <es-list-item>product3</es-list-item>
                    <es-list-item>product1</es-list-item>
                    <es-list-item>product2</es-list-item>
                    <es-list-item>product3</es-list-item>
                    <es-list-item>product1</es-list-item>
                    <es-list-item>product2</es-list-item>
                    <es-list-item>product3</es-list-item>
                    <es-list-item>product1</es-list-item>
                    <es-list-item>product2</es-list-item>
                    <es-list-item>product3</es-list-item>
                </es-list>
            </el-scrollbar>
            <div class="browse-operation" :class="show_side ? 'browse-operation-open' : 'browse-operation-hide'"
                @click="show_side = !show_side">
                <el-icon v-if="show_side" :size="12">
                    <arrow-left />
                </el-icon>
                <el-icon v-else :size="12">
                    <arrow-right />
                </el-icon>
            </div>
            <div class="browse-content" :class="show_side ? 'browse-content-open' : 'browse-content-hide'">
                内容
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

import EsList from '@/components/EsList/index.vue';
import EsListItem from '@/components/EsList/item.vue';
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue";

export default defineComponent({
    name: 'data_browse',
    components: { EsList, EsListItem, ArrowLeft, ArrowRight },
    data: () => ({
        show_side: true
    }),
});
</script>
<style scoped lang="less">
.data-browse {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 1px solid #e4e7ed;

    .browse-header {
        padding: 18px 20px;
        border-bottom: 1px solid #e4e7ed;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
    }

    .browse-main {
        position: absolute;
        top: 69px;
        left: 0;
        right: 0;
        bottom: 0;

        .browse-side {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 400px;
            border-right: #f2f2f2 solid 1px;
        }

        .browse-side-hide {
            width: 0;

        }

        .browse-side-open {
            width: 400px;
        }

        .browse-operation {
            position: absolute;
            top: 45%;
            background-color: #e3e9ed;
            width: 12px;
            height: 56px;
            line-height: 56px;
            text-align: center;
            cursor: pointer;
            z-index: 1;

            &:hover {
                background-color: #ebf0f2;
            }

        }

        .browse-operation-hide {
            left: 0;

        }

        .browse-operation-open {
            left: 400px;
        }

        .browse-content {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            padding: 0 10px;
        }

        .browse-content-hide {
            left: 0;
        }

        .browse-content-open {
            left: 400px;
        }
    }
}
</style>