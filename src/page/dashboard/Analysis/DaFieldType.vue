<template>
    <a-spin :loading="loading">
        <div style="overflow-x: hidden;">
            <a-form :model="config" layout="vertical">
                <a-row :gutter="14">
                    <a-col :span="12">
                        <a-form-item label="索引">
                            <a-select v-model="config.index" allow-clear allow-search>
                                <a-option v-for="index in indices" :key="index.name" :value="index.name">{{
                                        index.name
                                    }}
                                </a-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="字段">
                            <a-select v-model="config.field" allow-clear allow-search allow-create>
                                <a-option v-for="field in fields" :key="field.name" :value="field.name">
                                    {{ field.label }}
                                </a-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item label="分析的字符串">
                    <a-input v-model="config.text" allow-clear placeholder="请输入要分析的字符串"/>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" @click="exec()">开始分析</a-button>
                </a-form-item>
            </a-form>
            <a-table :data="tokens" :pagination="false">
                <template #columns>
                    <a-table-column title="token" data-index="token" />
                    <a-table-column title="position" data-index="position" />
                    <a-table-column title="start_offset" data-index="start_offset" />
                    <a-table-column title="end_offset" data-index="end_offset" />
                    <a-table-column title="type" data-index="type" />
                </template>
            </a-table>
        </div>
    </a-spin>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import useIndexStore from "@/store/IndexStore";
import Field from "@/view/Field";
import {Token} from "@/components/es/domain/Analyze";
import MessageUtil from "@/utils/MessageUtil";
import DocumentApi from "@/components/es/api/DocumentApi";

const config = ref({
    index: "",
    field: "",
    text: ""
});
const fields = ref<Array<Field>>(new Array<Field>());
const tokens = ref<Array<Token>>(new Array<Token>());
const loading = ref(false);

const indices = computed(() => useIndexStore().indices);
watch(() => config.value.index, index => {
    fields.value = useIndexStore().field(index);
    config.value.field = "";
});

function exec() {
    if (config.value.index.trim() === '') {
        MessageUtil.warning("请选择索引");
        return;
    }
    if (config.value.field.trim() === '') {
        MessageUtil.warning("请选择字段");
        return;
    }
    if (config.value.text.trim() === '') {
        MessageUtil.warning("请输入要分析的字符串");
        return;
    }
    tokens.value = [];
    loading.value = true;
    DocumentApi(config.value.index)
        ._analyze(config.value.field, config.value.text)
        .then(rsp => tokens.value = rsp.tokens)
        .catch(e => MessageUtil.error("执行失败", e))
        .finally(() => loading.value = false);
}

</script>
<style scoped>

</style>
