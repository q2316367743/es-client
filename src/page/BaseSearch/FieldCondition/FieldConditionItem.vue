<template>
    <div class="field-condition-item">
        <!-- 选择查询模式 -->
        <a-select v-model="condition.type" filterable :placeholder="$t('baseSearch.placeholder.condition')"
                  style="width: 110px;">
            <a-option label="must" value="must"></a-option>
            <a-option label="must_not" value="must_not"></a-option>
            <a-option label="should" value="should"></a-option>
        </a-select>
        <!-- 选择查询字段 -->
        <a-select v-model="condition.field" allow-search :placeholder="$t('baseSearch.placeholder.field')"
                  style="margin-left: 10px;width: 250px;">
            <a-option v-for="(field, idx) in fields" :key="idx" :label="field.name" :value="field.name"></a-option>
        </a-select>
        <!-- 选择查询条件 -->
        <!-- TODO: 此处还需处理，对于不同类型，需要不同查询条件 -->
        <a-select v-model="condition.condition" filterable :placeholder="$t('baseSearch.placeholder.condition')"
                  style="margin-left: 10px;width: 110px;">
            <!-- 分词查询 -->
            <a-option label="match" value="match"></a-option>
            <!-- 精准查询 -->
            <a-option label="term" value="term"></a-option>
            <!-- 通配符查询 -->
            <a-option label="wildcard" value="wildcard"></a-option>
            <a-option label="range" value="range"></a-option>
            <a-option label="range lt" value="range_lt"></a-option>
            <a-option label="range lte" value="range_lte"></a-option>
            <a-option label="range gt" value="range_gt"></a-option>
            <a-option label="range gte" value="range_gte"></a-option>
        </a-select>
        <a-input v-model="condition.value" style="width: 180px; margin-left: 10px"/>
        <!-- 操作 -->
        <a-button type="primary" style="margin-left: 10px" @click="add">{{
                $t('common.operation.add')
            }}
        </a-button>
        <a-button type="primary" status="danger" @click="remove(condition.id)">{{
                $t('common.operation.delete')
            }}
        </a-button>
    </div>
</template>
<script lang="ts">
import BaseQuery from "@/entity/BaseQuery";
import Field from "@/view/Field";
import {defineComponent, PropType} from "vue";

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
.field-condition-item {
    display: flex;
}
</style>