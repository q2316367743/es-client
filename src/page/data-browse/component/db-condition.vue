<template>
    <div class="condition">
        <a-split :default-size="0.5">
            <template #first>
                <a-split :default-size="0.5">
                    <template #first>
                        <div class="condition-item">
                            <div :class="must === '' ? 'disable' : ''" class="key">MUST</div>
                            <a-auto-complete type="text" v-model="must" class="input" @keydown.enter="executeQuery()"
                                             placeholder="field1='str',field2=num" :data="mustData"
                                             @search="mustDataSearch($event)" allow-clear style="padding: 0"
                                             @clear="mustDataSearch('')"/>
                        </div>
                    </template>
                    <template #second>
                        <div class="condition-item">
                            <div :class="should === '' ? 'disable' : ''" class="key">SHOULD</div>
                            <a-auto-complete type="text" v-model="should" class="input" @keydown.enter="executeQuery()"
                                             placeholder="field1='str',field2=num" :data="shouldData"
                                             @search="shouldDataSearch($event)" allow-clear style="padding: 0"
                                             @clear="shouldDataSearch('')"/>
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
                            <a-auto-complete type="text" v-model="mustNot" class="input" @keydown.enter="executeQuery()"
                                             placeholder="field1='str',field2=num" :data="mustNotData"
                                             @search="mustNotDataSearch($event)" allow-clear style="padding: 0"
                                             @clear="mustNotDataSearch('')"/>
                            <div class="clear" v-show="mustNot !== ''" @click="clear('mustNot')">
                                <icon-close-circle/>
                            </div>
                        </div>
                    </template>
                    <template #second>
                        <div class="condition-item">
                            <div :class="orderBy === '' ? 'disable' : ''" class="key">ORDER</div>

                            <a-auto-complete type="text" v-model="orderBy" class="input" @keydown.enter="executeQuery()"
                                             placeholder="field1='str',field2=num" :data="orderByData"
                                             @search="orderByDataSearch($event)" allow-clear style="padding: 0"
                                             @clear="orderByDataSearch('')"/>
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
import {ConditionStrBuild, OrderByStrBuild} from "@/page/data-browse/build/ConditionStrBuild";

const must = ref(useDataBrowseStore().must);
const should = ref(useDataBrowseStore().should);
const mustNot = ref(useDataBrowseStore().mustNot);
const orderBy = ref(useDataBrowseStore().orderBy);
const mustData = ref<Array<string>>(ConditionStrBuild(''));
const shouldData = ref<Array<string>>(ConditionStrBuild(''));
const mustNotData = ref<Array<string>>(ConditionStrBuild(''));
const orderByData = ref<Array<string>>(ConditionStrBuild(''));

watch(() => must.value, value => useDataBrowseStore().updateMust(value));
watch(() => should.value, value => useDataBrowseStore().updateShould(value));
watch(() => mustNot.value, value => useDataBrowseStore().updateMustNot(value));
watch(() => orderBy.value, value => useDataBrowseStore().updateOrderBy(value));

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

const mustDataSearch = (value: string) => mustData.value = ConditionStrBuild(value);
const shouldDataSearch = (value: string) => shouldData.value = ConditionStrBuild(value);
const mustNotDataSearch = (value: string) => mustNotData.value = ConditionStrBuild(value);
const orderByDataSearch = (value: string) => orderByData.value = OrderByStrBuild(value);

</script>
<style scoped></style>
