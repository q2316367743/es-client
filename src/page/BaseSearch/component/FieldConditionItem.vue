<template>
    <div>
        <!-- 选择查询模式 -->
        <el-select v-model="condition.type" filterable placeholder="请选择">
            <el-option label="must" value="must"></el-option>
            <el-option label="must_not" value="must_not"></el-option>
            <el-option label="should" value="should"></el-option>
        </el-select>
        <!-- 选择查询字段 -->
        <el-select
            v-model="condition.field"
            filterable
            placeholder="请选择"
            style="margin-left: 10px"
            value-key="name"
        >
            <el-option
                v-for="(field, idx) in fields"
                :key="idx"
                :label="field.name"
                :value="{
                    name: field.name,
                    type: field.type
                }"
            ></el-option>
        </el-select>
        <!-- 选择查询条件 -->
        <!-- TODO: 此处还需处理，对于不同类型，需要不同查询条件 -->
        <el-select
            v-model="condition.condition"
            filterable
            placeholder="请选择"
            style="margin-left: 10px"
        >
            <el-option
                label="match"
                value="match"
                v-if="
                    condition.field.type === 'keyword' ||
                    condition.field.type === 'text'
                "
            ></el-option>
            <el-option
                label="term"
                value="term"
                v-if="
                    condition.field.type === 'date' ||
                    condition.field.type === 'long' ||
                    condition.field.type === 'text' ||
                    condition.field.type === 'date' ||
                    condition.field.type === 'short'
                "
            ></el-option>
            <el-option
                label="wildcard"
                value="wildcard"
                v-if="
                    condition.field.type === 'keyword' ||
                    condition.field.type === 'text'
                "
            ></el-option>
            <el-option
                label="prefix"
                value="prefix"
                v-if="
                    condition.field.type === 'keyword' ||
                    condition.field.type === 'text'
                "
            ></el-option>
            <el-option
                label="range"
                value="range"
                v-if="
                    condition.field.type === 'long' ||
                    condition.field.type === 'keyword' ||
                    condition.field.type === 'text' ||
                    condition.field.type === 'date' ||
                    condition.field.type === 'short'
                "
            ></el-option>
            <el-option
                label="fuzzy"
                value="fuzzy"
                v-if="
                    condition.field.type === 'long' ||
                    condition.field.type === 'keyword' ||
                    condition.field.type === 'text' ||
                    condition.field.type === 'date' ||
                    condition.field.type === 'short'
                "
            ></el-option>
            <el-option
                label="query_string"
                value="query_string"
                v-if="
                    condition.field.type === 'long' ||
                    condition.field.type === 'keyword' ||
                    condition.field.type === 'text' ||
                    condition.field.type === 'date' ||
                    condition.field.type === 'short'
                "
            ></el-option>
            <el-option
                label="text"
                value="text"
                v-if="
                    condition.field.type === 'keyword' ||
                    condition.field.type === 'text'
                "
            ></el-option>
            <el-option
                label="missing"
                value="missing"
                v-if="
                    condition.field.type === 'long' ||
                    condition.field.type === 'keyword' ||
                    condition.field.type === 'text' ||
                    condition.field.type === 'date' ||
                    condition.field.type === 'short'
                "
            ></el-option>
        </el-select>
        <el-input
            v-model="condition.value"
            style="width: 180px; margin-left: 10px"
            v-if="condition.condition === 'match' ||
                condition.condition === 'term' ||
                condition.condition === 'wildcard' ||
                condition.condition === 'prefix' ||
                condition.condition === 'query_string' ||
                condition.condition === 'text'
            "
        ></el-input>
        <div style="display: inline-block;margin-left: 10px" v-if="condition.condition === 'range'">
            <el-select v-model="condition.extra_left_cindition">
                <el-option value="gt" label="gt"></el-option>
                <el-option value="gte" label="gte"></el-option>
            </el-select>
            <el-input v-model="condition.extra_left_value" style="width: 180px;margin-left: 10px;"></el-input>
            <el-select v-model="condition.extra_right_cindition" style="margin-left: 10px;">
                <el-option value="lt" label="lt"></el-option>
                <el-option value="lte" label="lte"></el-option>
            </el-select>
            <el-input v-model="condition.extra_right_value" style="width: 180px;margin-left: 10px;"></el-input>
        </div>
    </div>
</template>
<script lang="ts">
import BaseQuery from "@/entity/BaseQuery";
import Field from "@/view/Field";
import { defineComponent, PropType } from "vue";

export default defineComponent({
    props: {
        value: Object as PropType<BaseQuery>,
        fields: {
            type: Array as PropType<Array<Field>>,
            default: () => [] as Array<Field>
        }
    },
    data: () => ({
        condition: {} as BaseQuery
    }),
    created() {
        this.condition = this.value!;
    },
    watch: {
        condition() {
            this.$emit("update:value", this.condition);
        }
    }
});
</script>
<style scoped>
</style>