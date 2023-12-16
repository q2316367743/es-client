<template>
    <div class="condition">
        <a-split :default-size="0.5">
            <template #first>
                <a-split :default-size="0.5">
                    <template #first>
                        <div class="condition-item">
                            <div :class="must === '' ? 'disable' : ''" class="key">MUST</div>
                            <a-input type="text" v-model="must" class="input" @keydown.enter="executeQuery()"
                                     placeholder="field1='str',field2=num" allow-clear style="padding: 0"/>
                        </div>
                    </template>
                    <template #second>
                        <div class="condition-item">
                            <div :class="should === '' ? 'disable' : ''" class="key">SHOULD</div>
                            <a-input type="text" v-model="should" class="input" @keydown.enter="executeQuery()"
                                     placeholder="field1='str',field2=num" allow-clear style="padding: 0"/>
                            <div class="clear" v-show="should !== ''" @click="clear('should')">
                                <icon-close-circle/>
                            </div>
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
                                     placeholder="field1='str',field2=num" allow-clear style="padding: 0"/>
                            <div class="clear" v-show="mustNot !== ''" @click="clear('mustNot')">
                                <icon-close-circle/>
                            </div>
                        </div>
                    </template>
                    <template #second>
                        <div class="condition-item">
                            <div :class="orderBy === '' ? 'disable' : ''" class="key">ORDER</div>
                            <a-input type="text" v-model="orderBy" class="input" @keydown.enter="executeQuery()"
                                     placeholder="field1='str',field2=num" allow-clear style="padding: 0"/>
                        </div>
                    </template>
                </a-split>
            </template>
        </a-split>
    </div>
</template>
<script lang="ts" setup>
import {ref, watch} from "vue";
import {useDataBrowseStore} from "@/store/components/DataBrowseStore";

const must = ref(useDataBrowseStore().query.mustStr);
const should = ref(useDataBrowseStore().query.shouldStr);
const mustNot = ref(useDataBrowseStore().query.mustNotStr);
const orderBy = ref(useDataBrowseStore().query.orderByStr);

watch(() => must.value, value => useDataBrowseStore().query.setMustStr(value));
watch(() => should.value, value => useDataBrowseStore().query.setMustNotStr(value));
watch(() => mustNot.value, value => useDataBrowseStore().query.setShouldStr(value));
watch(() => orderBy.value, value => useDataBrowseStore().query.setOrderByStr(value));

const executeQuery = () => useDataBrowseStore().executeQuery(false);
const clear = (value: 'must' | 'should' | 'mustNot' | 'orderBy') => {
    switch (value) {
        case "must":
            must.value = '';
            break;
        case "should":
            should.value = '';
            break;
        case "mustNot":
            mustNot.value = '';
            break;
        case "orderBy":
            orderBy.value = '';
            break;
    }
    useDataBrowseStore().executeQuery(false);
}


</script>
<style scoped></style>
