<template>
    <div class="history-manage">
        <el-tabs v-model="active" class="history-manage-tabs">
            <el-tab-pane label="临时" name="temp"></el-tab-pane>
            <el-tab-pane label="历史" name="history"></el-tab-pane>
        </el-tabs>
        <div class="history-manage-body">
            <!-- 临时记录 -->
            <hm-temp-record @load="load" v-show="active === 'temp'"/>
            <!-- 历史记录 -->
            <el-scrollbar v-show="active === 'history'">
                <hm-history @load="load"/>
            </el-scrollbar>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import HistoryEntity from "@/entity/HistoryEntity";
import HmTempRecord from "@/module/HistoryManage/TempRecord.vue";
import HmHistory from "@/module/HistoryManage/History.vue";


export default defineComponent({
    name: 'history-manage',
    components: {HmHistory, HmTempRecord},
    emits: ['load'],
    data: () => ({
        active: 'temp'
    }),
    methods: {
        load(history: HistoryEntity) {
            this.$emit('load', history);
        }
    }
});
</script>
<style scoped lang="less">
.history-manage {
    position: absolute;
    top: 80px;
    left: 20px;
    right: 20px;
    bottom: 20px;

    .history-manage-body {
        position: absolute;
        top: 54px;
        left: 0;
        right: 0;
        bottom: 0;

    }
}
</style>