<template>
    <a-button type="primary" status="warning" @click="dialog= true" title="历史">
        <template #icon>
            <icon-history/>
        </template>
    </a-button>
    <a-drawer v-model:visible="dialog" width="60%" title="历史记录" render-to-body unmount-on-close :footer="false"
              :header="false" popup-container="#main">
        <div class="bsh-manage">
            <a-tabs v-model:active-key="active" class="history-manage-tabs">
                <a-tab-pane title="临时" key="temp"></a-tab-pane>
                <a-tab-pane title="历史" key="history"></a-tab-pane>
            </a-tabs>
            <div class="bsh-manage-body">
                <!-- 临时记录 -->
                <bsh-temp-record @load="load" v-show="active === 'temp'"/>
                <!-- 历史记录 -->
                <bsh-history @load="load" v-show="active === 'history'"/>
            </div>
        </div>
    </a-drawer>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import BshTempRecord from "./TempRecord.vue";
import BshHistory from "./History.vue";


export default defineComponent({
    name: 'bsh-manage',
    components: {BshHistory, BshTempRecord},
    emits: ['update:modelValue'],
    data: () => ({
        active: 'temp',
        dialog: false
    }),
    methods: {
        load() {
            this.dialog = false;
        }
    }
});
</script>
<style scoped lang="less">
.bsh-manage {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;

    .bsh-manage-body {
        position: absolute;
        top: 54px;
        left: 0;
        right: 0;
        bottom: 0;

    }
}
</style>
