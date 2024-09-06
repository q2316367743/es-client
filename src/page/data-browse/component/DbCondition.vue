<template>
    <div class="condition">
        <a-split :default-size="0.5">
            <template #first>
                <a-split :default-size="0.5">
                    <template #first>
                        <div class="condition-item">
                            <div :class="must === '' ? 'disable' : ''" class="key">MUST</div>
                            <a-input type="text" v-model="must" class="input" @keydown.enter="executeQuery()"
                                     placeholder="field1='str',field2=num" allow-clear style="padding: 0"
                                     @clear="clear()"/>
                        </div>
                    </template>
                    <template #second>
                        <div class="condition-item">
                            <div :class="should === '' ? 'disable' : ''" class="key">SHOULD</div>
                            <a-input type="text" v-model="should" class="input" @keydown.enter="executeQuery()"
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
                            <div :class="mustNot === '' ? 'disable' : ''" class="key">MUST_NOT</div>
                            <a-input type="text" v-model="mustNot" class="input" @keydown.enter="executeQuery()"
                                     placeholder="field1='str',field2=num" allow-clear style="padding: 0"
                                     @clear="clear()"/>
                        </div>
                    </template>
                    <template #second>
                        <div class="condition-item">
                            <div :class="orderBy === '' ? 'disable' : ''" class="key">ORDER</div>
                            <a-input type="text" v-model="orderBy" class="input" @keydown.enter="executeQuery()"
                                     placeholder="field1 asc,field2 desc" allow-clear style="padding: 0"
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
import {nextTick} from "vue";
import {useDbConditionStore} from "@/page/data-browse/store/DbConditionStore";

const {must, should, mustNot, orderBy} = useDbConditionStore()

const executeQuery = () => useDataBrowseStore().executeQuery(false);
const clear = () => nextTick(() => useDataBrowseStore().executeQuery(false));


</script>
<style scoped></style>
