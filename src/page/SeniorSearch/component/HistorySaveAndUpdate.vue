<template>
    <a-form :model="data" label-position="left" label-width="100px">
        <a-form-item label="名称">
            <a-input v-model="data.name" style="width: 350px"/>
        </a-form-item>
        <a-form-item label="所属链接">
            <a-select v-model="data.urlId">
                <a-option :value="0" label="忽略"/>
                <a-option v-for="item in urls" :value="item.id" :label="item.name"/>
            </a-select>
        </a-form-item>
        <a-form-item label="参数">
            <a-textarea v-model="data.body" :rows="12"/>
        </a-form-item>
        <a-form-item>
            <a-button @click="reset">重置</a-button>
            <a-button type="primary" @click="submit">{{ data.id === 0 ? '新增' : '修改' }}</a-button>
        </a-form-item>
    </a-form>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";
import SeniorSearchHistory from "@/entity/SeniorSearchHistory";
import {mapState} from "pinia";
import useUrlStore from "@/store/UrlStore";

export default defineComponent({
    name: 'history-save-and-update',
    props: {
        modelValue: Object as PropType<SeniorSearchHistory>,
    },
    emits: ['update:modelValue', 'submit'],
    data: () => ({
        data: {
            id: 0,
            name: '',
            urlId: 0,
            body: ''
        } as SeniorSearchHistory,
        old: {
            id: 0,
            name: '',
            urlId: 0,
            body: ''
        } as SeniorSearchHistory
    }),
    watch: {
        data() {
            this.$emit('update:modelValue', this.data);
        },
        modelValue() {
            if (this.modelValue) {
                this.data = this.modelValue;
                this.old = JSON.parse(JSON.stringify(this.data));
            }
        }
    },
    computed: {
        ...mapState(useUrlStore, ['urls'])
    },
    created() {
        if (this.modelValue) {
            this.data = this.modelValue;
            this.old = JSON.parse(JSON.stringify(this.data));
        }
    },
    methods: {
        submit() {
            this.$emit('submit');
        },
        reset() {
            this.data = JSON.parse(JSON.stringify(this.old));
        }
    }
});
</script>
<style scoped>

</style>