<template>
    <div class="index-container" @scroll="scrollListener" ref="container">
        <div class="index-bar" ref="bar" :style="{ top: bar_top + 'px', height: bar_height + 'px' }"></div>
        <div class="index-content">
            <index-item v-for="(item, index) in items" :key="index" :index="item"></index-item>
        </div>
    </div>
</template>
<script lang="ts">
import Index from "@/view/Index";
import { defineComponent, PropType } from "vue";
import IndexItem from "./IndexItem.vue";

const offset_height: number = 4;

export default defineComponent({
    name: 'IndexContainer',
    components: { IndexItem },
    props: {
        indices: Object as PropType<Array<Index>>
    },
    data: () => ({
        // 每一个高度
        item_height: 96,
        // 总高度
        items_height: 96,
        // 显示的个数
        show_number: 1,
        start_height: 0,
        start_index: 1,
    }),
    computed: {
        items() {
            return this.indices?.splice(this.start_index - 1, this.start_index + this.show_number + offset_height);
        },
        bar_height() {
            let proportion = this.show_number / this.indices?.length!;
            if (proportion > 1) {
                proportion = 1;
            } else if (proportion < 0.1) {
                proportion = 0.1;
            }
            return this.items_height * proportion;
        },
        bar_top() {
            return this.items_height * (this.start_height / this.items_height)
        }
    },
    mounted() {
        // 此处获取当前容器高度
        let container = this.$refs.container as HTMLElement;
        this.items_height = container.clientHeight;
        this.show_number = parseInt((this.items_height / this.item_height) + "");
    },
    methods: {
        scrollListener(event: UIEvent) {
            console.log("向上")
            let target = event.target as Element;
            this.start_height = target.scrollTop;
            this.start_index = Math.floor(this.start_height / this.items_height)
        }
    }
});
</script>
<style lang="less">
.index-container {
    height: 500px;
    position: relative;
    overflow-y: auto;
    .index-bar {
        position: absolute;
        right: 0px;
        width: 6px;
        background-color: #dedfe1;
    }
    .index-content {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
}
</style>