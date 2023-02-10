<template>
    <div class="page-help">
        <div class="item" :class="page === 1 ? 'disable' : ''" @click="toFirst">
            <i class="vxe-icon-arrow-double-left"/>
        </div>
        <div class="item" :class="page === 1 ? 'disable' : ''" @click="prePage">
            <i class="vxe-icon-arrow-left"/>
        </div>
        <a-dropdown trigger="click" @command="pageSizeChange">
            <div class="item" style="font-size: 12px;line-height: 20px;">
                {{ (page - 1) * size }} - {{ Math.min(page * size, total) }}
            </div>
            <template #dropdown>
                    <a-doption value="1">10</a-doption>
                    <a-doption value="2">100</a-doption>
                    <a-doption value="3">250</a-doption>
                    <a-doption value="4">500</a-doption>
                    <a-doption value="5">1,000</a-doption>
                    <a-doption value="6">自定义</a-doption>
            </template>
        </a-dropdown>
        <div class="item" style="font-size: 12px">
            / {{ total }}
        </div>
        <div class="item" :class="page * size > total ? 'disable' : ''" @click="nextPage">
            <i class="vxe-icon-arrow-right"/>
        </div>
        <div class="item" :class="page * size > total ? 'disable' : ''" @click="toLast">
            <i class="vxe-icon-arrow-double-right"/>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import MessageBoxUtil from "@/utils/MessageBoxUtil";

export default defineComponent({
    name: 'page-help',
    props: {
        page: {
            type: Number,
            required: true,
            default: 0
        },
        size: {
            type: Number,
            required: true,
            default: 0
        },
        total: {
            type: Number,
            required: true,
            default: 0
        }
    },
    emit: ['pageUpdate', 'update:page', 'update:size'],
    methods: {
        update() {
            this.$emit('pageUpdate');
        },
        updatePage(page: number) {
            this.$emit("update:page", page);
        },
        updateSize(size: number) {
            this.$emit("update:size", size);
        },
        toFirst() {
            if (this.page === 1) {
                return;
            }
            this.updatePage(1);
            this.update();
        },
        prePage() {
            if (this.page === 1) {
                return;
            }
            this.updatePage(this.page - 1);
            this.update();
        },
        pageSizeChange(command: string) {
            this.pageSizeChangeExec(command, this.update, (page, size) => {
                this.updatePage(page);
                this.updateSize(size);
            })
        },
        nextPage() {
            if (this.page * this.size > this.total) {
                return;
            }
            this.updatePage(this.page + 1);
            this.update();
        },
        toLast() {
            this.updatePage(Math.ceil(this.total / this.size));
            this.update();
        },
        pageSizeChangeExec(command: string, executeQuery: () => void, callback: (page: number, size: number) => void) {
            switch (command) {
                case "1":
                    callback(1, 10);
                    executeQuery();
                    break;
                case "2":
                    callback(1, 100);
                    executeQuery();
                    break;
                case "3":
                    callback(1, 250);
                    executeQuery();
                    break;
                case "4":
                    callback(1, 500);
                    executeQuery();
                    break;
                case "5":
                    callback(1, 1000);
                    executeQuery();
                    break;
                case "6":
                    MessageBoxUtil.prompt('请输入自定义分页大小', '自定义分页', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        inputPattern: /\d+/,
                        inputErrorMessage: '请输入正确的数字',
                    })
                        .then((value) => {
                            callback(1, parseInt(value));
                            executeQuery();
                        })
                        .catch(() => {
                        });
                    break
            }
        }
    }
});
</script>
<style scoped>
.page-help {
    display: flex;
}
</style>