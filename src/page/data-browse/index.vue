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
<script lang="ts" setup>
import DbCondition from "@/page/data-browse/component/db-condition.vue";
import DbHeader from "@/page/data-browse/component/DbHeader/index.vue";
import DbContainer from "@/page/data-browse/component/DbContainer/index.vue";
import {statistics} from "@/global/BeanFactory";
import {useDbSettingStore} from "@/page/data-browse/store/DbSettingStore";


statistics.access("功能统计", "数据浏览");

useDbSettingStore().init();

</script>
<style lang="less">
@import url(./index.less);
</style>
