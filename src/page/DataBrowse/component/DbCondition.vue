<template>
    <div class="condition">
        <div class="condition-item">
            <div :class="must === '' ? 'disable' : ''" class="key">MUST</div>
            <input type="text" v-model="must" class="input" @keydown.enter="executeQuery()"/>
            <div class="clear" v-show="must !== ''" @click="clear('mustValue')">
                <icon-close-circle/>
            </div>
        </div>
        <div class="condition-sep"></div>
        <div class="condition-item">
            <div :class="should === '' ? 'disable' : ''" class="key">SHOULD</div>
            <input type="text" v-model="should" class="input" @keydown.enter="executeQuery()"/>
            <div class="clear" v-show="should !== ''" @click="clear('shouldValue')">
                <icon-close-circle/>
            </div>
        </div>
        <div class="condition-sep"></div>
        <div class="condition-item">
            <div :class="mustNot === '' ? 'disable' : ''" class="key">MUST_NOT</div>
            <input type="text" v-model="mustNot" class="input" @keydown.enter="executeQuery()"/>
            <div class="clear" v-show="mustNot !== ''" @click="clear('mustNotValue')">
                <icon-close-circle/>
            </div>
        </div>
        <div class="condition-sep"></div>
        <div class="condition-item">
            <div :class="orderBy === '' ? 'disable' : ''" class="key">ORDER</div>
            <input type="text" v-model="orderBy" class="input" @keydown.enter="executeQuery"/>
            <div class="clear" v-show="orderBy !== ''" @click="clear('orderByValue')">
                <icon-close-circle/>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: 'db-condition',
    emit: ['executeQuery', 'update:mustValue', 'update:shouldValue', 'update:mustNotValue', 'update:orderByValue'],
    props: {
        mustValue: String,
        shouldValue: String,
        mustNotValue: String,
        orderByValue: String
    },
    data: () => ({
        must: '',
        should: '',
        mustNot: '',
        orderBy: ''
    }),
    watch: {
        mustValue(newValue: string) {
            this.must = newValue;
        },
        must(newValue: string) {
            this.$emit('update:mustValue', newValue);
        },

        shouldValue(newValue: string) {
            this.should = newValue;
        },
        should(newValue: string) {
            this.$emit('update:shouldValue', newValue);
        },

        mustNotValue(newValue: string) {
            this.mustNot = newValue;
        },
        mustNot(newValue: string) {
            this.$emit('update:mustNotValue', newValue);
        },

        orderByValue(newValue: string) {
            this.orderBy = newValue;
        },
        orderBy(newValue: string) {
            this.$emit('update:orderByValue', newValue);
        },
    },
    methods: {
        executeQuery() {
            this.$emit('executeQuery');
        },
        clear(value: string) {
            this.$emit('update:' + value, '');
            this.$emit('executeQuery');
        }
    }
});
</script>
<style scoped>

</style>