<template>
    <div class="condition">
        <a-split :default-size="0.5">
            <template #first>
                <a-split :default-size="0.5">
                    <template #first>
                        <div class="condition-item">
                            <div :class="mustStr === '' ? 'disable' : ''" class="key">MUST</div>
                            <a-input type="text" v-model="mustStr" class="input" @keydown.enter="executeQuery()"
                                     placeholder="field1='str',field2=num" allow-clear style="padding: 0"
                                     @clear="clear()"/>
                        </div>
                    </template>
                    <template #second>
                        <div class="condition-item">
                            <div :class="shouldStr === '' ? 'disable' : ''" class="key">SHOULD</div>
                            <a-input type="text" v-model="shouldStr" class="input" @keydown.enter="executeQuery()"
                                     placeholder="field1='str',field2=num" allow-clear style="padding: 0"
                                     @clear="clear()"/>
                        </div>
                    </template>
                </a-split>
            </template>
            <template #second>
                <a-split :default-size="0.5">
                    <template #first>
                        <div class="condition-item">
                            <div :class="mustNotStr === '' ? 'disable' : ''" class="key">MUST_NOT</div>
                            <a-input type="text" v-model="mustNotStr" class="input" @keydown.enter="executeQuery()"
                                     placeholder="field1='str',field2=num" allow-clear style="padding: 0"
                                     @clear="clear()"/>
                        </div>
                    </template>
                    <template #second>
                        <div class="condition-item">
                            <div :class="orderByStr === '' ? 'disable' : ''" class="key">ORDER</div>
                            <a-input type="text" v-model="orderByStr" class="input" @keydown.enter="executeQuery()"
                                     placeholder="field1='str',field2=num" allow-clear style="padding: 0"
                                     @clear="clear()"/>
                        </div>
                    </template>
                </a-split>
            </template>
        </a-split>
    </div>
</template>
<script lang="ts" setup>
import {useDataBrowseStore} from "@/store/components/DataBrowseStore";
import {useDbConditionState} from "@/page/data-browse/domain/DocumentCondition";
import {nextTick} from "vue";

const {mustStr, shouldStr, mustNotStr, orderByStr} = useDbConditionState()

const executeQuery = () => useDataBrowseStore().executeQuery(false);
const clear = () => {
    nextTick(() => useDataBrowseStore().executeQuery(false));
}


</script>
<style scoped></style>
