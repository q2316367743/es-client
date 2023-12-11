<template>
    <div id="data-browse">
        <!-- 顶部按钮 -->
        <db-header/>
        <!-- 输入条件 -->
        <db-condition/>
        <!-- 数据表格 -->
        <db-container/>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {Codemirror} from 'vue-codemirror';

import PageHelp from "@/page/data-browse/component/PageHelp.vue";
import DbCondition from "@/page/data-browse/component/db-condition.vue";
import DbIndexSelect from "@/page/data-browse/component/DbIndexSelect.vue";
import DbSimpleItem from "@/page/data-browse/component/DbSimpleItem.vue";
import DbHeader from "@/page/data-browse/component/DbHeader/index.vue";
import DbContainer from "@/page/data-browse/component/db-container.vue";

import StructureIcon from "@/icon/StructureIcon.vue";

import JsonView from "@/components/JsonView/index.vue";

export default defineComponent({
    name: 'data-browse',
    components: {
        DbContainer,
        DbHeader,
        DbSimpleItem,
        DbIndexSelect,
        DbCondition,
        PageHelp,
        JsonView,
        StructureIcon,
        Codemirror
    },
    data: () => {
        return {
            // 配置
        }
    },
});
</script>
<style lang="less">
@import url(./index.less);
</style>
