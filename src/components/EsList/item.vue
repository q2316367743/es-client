<template>
    <div class="es-list-item" :class="choose ? 'es-list-item-choose' : ''" @click="on_click">
        <div class="name">
            <div>
                <slot></slot>
            </div>
            <div>
                <el-tag v-for="(alias, index) of aliases" :key="index">{{ alias }}</el-tag>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: 'es-list-item',
    props: {
        choose: {
            default: false,
            required: false,
            type: Boolean
        },
        aliases: {
            default: [],
            required: false,
            type: Array
        }
    },
    emits: ['click', 'btn-click'],
    data: () => ({}),
    methods: {
        on_click(e: any) {
            this.$emit('click', e);
        },
    }
});
</script>
<style scoped lang="less">
.es-list {
    .es-list-item {
        height: 35px;
        line-height: 35px;
        background-color: #ffffff;
        margin: 0 3px;
        cursor: pointer;
        cursor: pointer;
        border-bottom: 1px solid #e4e7ed;

        &:hover {
            background-color: #f2f2f2;

        }

        .name {
            font-size: 14px;
            margin-left: 10px;
            display: flex;
            justify-content: space-between;

            .el-tag {
                margin-left: 5px;
            }
        }

    }

    .es-list-item-choose {
        background-color: #f2f2f2;
    }

}
</style>