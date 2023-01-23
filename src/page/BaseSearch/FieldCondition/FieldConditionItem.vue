<template>
    <div>
        <!-- 选择查询模式 -->
        <el-select v-model="condition.type" filterable :placeholder="$t('baseSearch.placeholder.condition')">
            <el-option label="must" value="must"></el-option>
            <el-option label="must_not" value="must_not"></el-option>
            <el-option label="should" value="should"></el-option>
        </el-select>
        <!-- 选择查询字段 -->
        <el-select v-model="condition.field" filterable :placeholder="$t('baseSearch.placeholder.condition')"
            style="margin-left: 10px">
            <el-option v-for="(field, idx) in fields" :key="idx" :label="field.name" :value="field.name"></el-option>
        </el-select>
        <!-- 选择查询条件 -->
        <!-- TODO: 此处还需处理，对于不同类型，需要不同查询条件 -->
        <el-select v-model="condition.condition" filterable :placeholder="$t('baseSearch.placeholder.condition')"
            style="margin-left: 10px">
            <!-- 分词查询 -->
            <el-option label="match" value="match"></el-option>
            <!-- 精准查询 -->
            <el-option label="term" value="term"></el-option>
            <!-- 通配符查询 -->
            <el-option label="wildcard" value="wildcard"></el-option>
            <el-option label="prefix" value="prefix" disabled></el-option>
            <el-option label="range" value="range"></el-option>
            <el-option label="fuzzy" value="fuzzy" disabled></el-option>
            <el-option label="query_string" value="query_string" disabled></el-option>
            <el-option label="missing" value="missing" disabled></el-option>
        </el-select>
        <el-input v-model="condition.value" style="width: 180px; margin-left: 10px"
            v-if="condition.condition !== 'range'"></el-input>
        <div style="display: inline-block;margin-left: 10px;" v-if="condition.condition === 'range'">
            <el-select v-model="condition.extra_left_condition" :placeholder="$t('baseSearch.placeholder.condition')">
                <el-option value="gt" label="gt"></el-option>
                <el-option value="gte" label="gte"></el-option>
            </el-select>
            <el-input v-model="condition.extra_left_value" style="width: 180px;margin-left: 10px;"></el-input>
            <el-select v-model="condition.extra_right_condition" style="margin-left: 10px;"
                :placeholder="$t('baseSearch.placeholder.condition')">
                <el-option value="lt" label="lt"></el-option>
                <el-option value="lte" label="lte"></el-option>
            </el-select>
            <el-input v-model="condition.extra_right_value" style="width: 180px;margin-left: 10px;"></el-input>
        </div>
        <!-- 操作 -->
        <el-button type="primary" style="margin-left: 10px" @click="add">{{
                $t('common.operation.add')
            }}
        </el-button>
        <el-button type="danger" @click="remove(condition.id)">{{
                $t('common.operation.delete')
            }}
        </el-button>
    </div>
</template>
<script lang="ts">
import BaseQuery from "@/entity/BaseQuery";
import Field from "@/view/Field";
import { defineComponent, PropType } from "vue";

export default defineComponent({
    name: 'field-condition-item',
    props: {
        modelValue: Object as PropType<BaseQuery>,
        fields: {
            type: Array as PropType<Array<Field>>,
            default: () => [] as Array<Field>
        }
    },
    emits: ['add', 'remove', 'update:modelValue'],
    data: () => ({
        condition: {} as BaseQuery
    }),
    created() {
        this.condition = this.modelValue!;
    },
    watch: {
        condition: {
            handler() {
                this.$emit("update:modelValue", this.condition);
            },
            deep: true
        },
        modelValue: {
            handler() {
                this.condition = this.modelValue!;
            },
            deep: true
        }
    },
    methods: {
        add() {
            this.$emit('add');
        },
        remove(id: number) {
            this.$emit('remove', id)
        }
    }
});
</script>
<style scoped>
</style>