<template>
    <div class="data-browse">
        <div class="browse-header">数据浏览</div>
        <div class="browse-main">
            <el-scrollbar class="browse-side">
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
            <div class="browse-content">
                内容
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

import EsList from '@/components/EsList/index.vue';
import EsListItem from '@/components/EsList/item.vue';

export default defineComponent({
    name: 'data_browse',
    components: { EsList, EsListItem },
    data: () => ({

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

        .browse-content {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 400px;
        }
    }
}
</style>