<template>
    <div class="condition">
        <a-split :default-size="0.5">
            <template #first>
                <a-split :default-size="0.5">
                    <template #first>
                        <div class="condition-item">
                            <div :class="must === '' ? 'disable' : ''" class="key">MUST</div>
                            <input type="text" v-model="must" class="input" @keydown.enter="executeQuery()"
                                placeholder="field1='str',field2=num" />
                            <div class="clear" v-show="must !== ''" @click="clear('mustValue')">
                                <icon-close-circle />
                            </div>
                        </div>
                    </template>
                    <template #second>
                        <div class="condition-item">
                            <div :class="should === '' ? 'disable' : ''" class="key">SHOULD</div>
                            <input type="text" v-model="should" class="input" @keydown.enter="executeQuery()"
                            placeholder="field1='str',field2=num" />
                            <div class="clear" v-show="should !== ''" @click="clear('shouldValue')">
                                <icon-close-circle />
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
                            <input type="text" v-model="mustNot" class="input" @keydown.enter="executeQuery()"
                                placeholder="field1='str',field2=num" />
                            <div class="clear" v-show="mustNot !== ''" @click="clear('mustNotValue')">
                                <icon-close-circle />
                            </div>
                        </div>
                    </template>
                    <template #second>
                        <div class="condition-item">
                            <div :class="orderBy === '' ? 'disable' : ''" class="key">ORDER</div>
                            <input type="text" v-model="orderBy" class="input" @keydown.enter="executeQuery"
                                placeholder="field1,field2 desc" />
                            <div class="clear" v-show="orderBy !== ''" @click="clear('orderByValue')">
                                <icon-close-circle />
                            </div>
                        </div>
                    </template>
                </a-split>
            </template>
        </a-split>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import {useDataBrowseStore} from "@/store/components/DataBrowseStore";

export default defineComponent({
    name: 'db-condition',
    data: () => ({
        must: '',
        should: '',
        mustNot: '',
        orderBy: ''
    }),
    watch: {
        must(newValue: string) {
            useDataBrowseStore().updateMust(newValue);
        },
        should(newValue: string) {
            useDataBrowseStore().updateShould(newValue);
        },
        mustNot(newValue: string) {
            useDataBrowseStore().updateMustNot(newValue);
        },
        orderBy(newValue: string) {
            useDataBrowseStore().updateOrderBy( newValue);
        },
    },
    methods: {
        executeQuery() {
            useDataBrowseStore().executeQuery(false);
        },
        clear(value: 'must' | 'should' | 'mustNot' | 'orderBy') {
            this[value] = '';
            useDataBrowseStore().executeQuery(false);
        }
    }
});
</script>
<style scoped></style>
