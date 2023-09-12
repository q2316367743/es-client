<template>
    <div class="field-condition-item">
        <!-- 是否启用 -->
        <a-switch :checked-value="true" :unchecked-value="false" type="round" v-model="condition.isEnable"
                  checked-color="rgb(var(--green-6))" unchecked-color="rgb(var(--red-6))"
                  style="margin: 4px 10px 4px 0;">
            <template #checked>启用</template>
            <template #unchecked>禁用</template>
        </a-switch>
        <!-- 选择查询模式 -->
        <a-select v-model="condition.type" filterable :placeholder="$t('baseSearch.placeholder.condition')"
                  style="width: 110px;">
            <a-option label="must" value="must"/>
            <a-option label="must_not" value="must_not"/>
            <a-option label="should" value="should"/>
        </a-select>
        <!-- 选择查询字段 -->
        <a-select v-model="condition.field" allow-search allow-create allow-clear placeholder="请选择查询字段"
                  style="margin-left: 10px;width: 250px;">
            <a-option v-for="(field, idx) in fields" :key="idx" :label="field.name" :value="field.name"/>
        </a-select>
        <!-- 选择查询条件 -->
        <!-- TODO: 此处还需处理，对于不同类型，需要不同查询条件 -->
        <a-select v-model="condition.condition" filterable :placeholder="$t('baseSearch.placeholder.condition')"
                  style="margin-left: 10px;width: 110px;" allow-search>
            <!-- 分词查询 -->
            <a-option label="match" value="match"/>
            <!-- 精准查询 -->
            <a-option label="term" value="term"/>
            <!-- 可以搜索多个值 -->
            <a-option label="terms" value="terms"/>
            <!-- 是否存在 -->
            <a-option label="exists" value="exists"/>
            <!-- 通配符查询 -->
            <a-option label="wildcard" value="wildcard"/>
            <a-option label="range lt" value="range_lt"/>
            <a-option label="range lte" value="range_lte"/>
            <a-option label="range gt" value="range_gt"/>
            <a-option label="range gte" value="range_gte"/>
        </a-select>
        <div class="condition-terms" v-if="condition.condition === 'terms'" @click="textArea">
            {{ condition.value }}
        </div>
        <a-input v-model="condition.value" style="width: 180px; margin-left: 10px;" v-else-if="condition.condition !== 'exists'" allow-clear/>
        <!-- 操作 -->
        <a-button type="primary" style="margin-left: 10px" @click="add()">
            <template #icon>
                <icon-plus />
            </template>
        </a-button>
        <a-button type="primary" status="danger" @click="remove(condition.id)">
            <template #icon>
                <icon-minus />
            </template>
        </a-button>
        <a-button type="primary" status="success" style="margin-left:10px;margin-right: 20px;" @click="search()">
            <template #icon>
                <icon-search />
            </template>
        </a-button>
    </div>
</template>
<script lang="ts">
import BaseQuery from "@/entity/BaseQuery";
import {defineComponent, PropType} from "vue";
import {mapState} from "pinia";
import {useBaseSearchStore} from "@/store/components/BaseSearchStore";

export default defineComponent({
    name: 'field-condition-item',
    props: {
        modelValue: Object as PropType<BaseQuery>,
        index: Number
    },
    emits: ['add', 'remove', 'editTextArea', 'update:modelValue'],
    data: () => ({
        condition: {} as BaseQuery
    }),
    computed: {
        ...mapState(useBaseSearchStore, ['fields'])
    },
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
        },
        textArea() {
            this.$emit('editTextArea', this.index);
        },
        search() {
            useBaseSearchStore().search();
        }
    }
});
</script>
<style scoped lang="less">
.field-condition-item {
    display: flex;

    .condition-terms {
        width: 180px;
        line-height: 32px;
        margin-left: 10px;
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 0 8px;
        color: var(--color-text-1);
        background-color: var(--color-fill-2);
        border: 1px solid transparent;
        border-radius: var(--border-radius-small);
    }
}
</style>
