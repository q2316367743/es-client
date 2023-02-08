<template>
    <el-form v-model="data" label-position="left" label-width="100px">
        <el-form-item label="名称">
            <el-input v-model="data.name" style="width: 350px"/>
        </el-form-item>
        <el-form-item label="所属链接">
            <el-select v-model="data.urlId">
                <el-option :value="0" label="忽略"/>
                <el-option v-for="item in urls" :value="item.id" :label="item.name"/>
            </el-select>
        </el-form-item>
        <el-form-item label="参数">
            <el-input v-model="data.body" type="textarea" :rows="12"/>
        </el-form-item>
        <el-form-item>
            <el-button @click="reset">重置</el-button>
            <el-button type="primary" @click="submit">{{ data.id === 0 ? '新增' : '修改' }}</el-button>
        </el-form-item>
    </el-form>
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