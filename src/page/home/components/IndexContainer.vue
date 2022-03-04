<template>
    <div class="index-container" @scroll="handleScroll">
        <div class="phantom" :style="{ minHeight: minHeight }">
            <div class="index-content" :style="{ transform: translate3d }">
                <index-item
                    v-for="(item, index) in items"
                    :key="index"
                    :index="item"
                    @open-dialog="openDialog"
                ></index-item>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Index from "@/view/Index";
import { defineComponent, PropType } from "vue";
import IndexItem from "./IndexItem.vue";

const item_height: number = 96;

export default defineComponent({
    name: 'IndexContainer',
    components: { IndexItem },
    emits: ['openDialog'],
    props: {
        indices: Object as PropType<Array<Index>>
    },
    data: () => ({
        items: new Array<Index>(),
        translate3d: ''
    }),
    computed: {
        minHeight() {
            return (item_height * (this.indices ? this.indices?.length! : 0)) + 'px';
        }
    },
    watch: {
        indices() {
            this.updateVisibleData();
        }
    },
    mounted() {
        this.updateVisibleData();
    },
    methods: {
        updateVisibleData(scrollTop: number = 0) {
            const visibleCount = Math.ceil(this.$el.clientHeight / item_height);
            const start = Math.floor(scrollTop / item_height);
            const end = start + visibleCount;
            this.items = this.indices?.slice(start, end)!;
            this.translate3d = `translate3d(0, ${start * item_height}px, 0)`;
        },
        handleScroll() {
            this.updateVisibleData(this.$el.scrollTop);
        },
        openDialog(name: string, result: any) {
            this.$emit('openDialog', name, result);
        }
    }
});
</script>
<style lang="less">
.index-container {
    position: absolute;
    top: 40px;
    left: 1px;
    right: 5px;
    bottom: 5px;
    overflow: auto;
}
</style>