<template>
    <div class="es-list-item" :class="choose ? 'es-list-item-choose' : ''" @click="on_click">
        <div class="name">
            <slot></slot>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'es-list-item',
    props: {
        choose: {
            default: false,
            required: false,
            type: Boolean
        }
    },
    emits: ['click', 'btn-click'],
    data: () => ({

    }),
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
        height: 30px;
        line-height: 30px;
        background-color: #ffffff;
        margin: 3px;
        cursor: pointer;
        cursor: pointer;
        border-bottom: 1px solid #e4e7ed;

        &:hover {
            background-color: #f2f2f2;

        }

        .name {
            font-size: 14px;
            margin-left: 10px;
        }

    }

    .es-list-item-choose {
        background-color: #f2f2f2;
    }

}
</style>