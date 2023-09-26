<template>
    <a-button-group type="text" size="mini" class="page-help">
        <a-button :disabled="page === 1" @click="toFirst()">
            <template #icon>
                <icon-double-left/>
            </template>
        </a-button>
        <a-button :disabled="page === 1" @click="prePage()">
            <template #icon>
                <icon-left/>
            </template>
        </a-button>
        <a-dropdown trigger="click" @select="pageSizeChange">
            <a-button style="font-size: 12px;line-height: 20px;">
                {{ (page - 1) * size }} - {{ Math.min(page * size, total) }}
            </a-button>
            <template #content>
                <a-doption value="1">10</a-doption>
                <a-doption value="2">100</a-doption>
                <a-doption value="3">250</a-doption>
                <a-doption value="4">500</a-doption>
                <a-doption value="5">1,000</a-doption>
                <a-doption value="6">自定义</a-doption>
            </template>
        </a-dropdown>
        <a-button style="font-size: 12px">
            / {{ total }}
        </a-button>
        <a-button :disabled="page * size > total" @click="nextPage()">
            <template #icon>
                <icon-right/>
            </template>
        </a-button>
        <a-button :disabled="page * size > total" @click="toLast()">
            <template #icon>
                <icon-double-right/>
            </template>
        </a-button>
    </a-button-group>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import {mapState} from "pinia";
import {useDataBrowseStore} from "@/store/components/DataBrowseStore";

export default defineComponent({
    name: 'page-help',
    computed: {
        ...mapState(useDataBrowseStore, ['page', 'size', 'total'])
    },
    methods: {
        update() {
            useDataBrowseStore().executeQuery(false);
        },
        updatePage(page: number) {
            useDataBrowseStore().updatePage(page);
        },
        updateSize(size: number) {
            useDataBrowseStore().updateSize(size);
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
        pageSizeChange(command: any) {
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
                        inputValue: this.size + ''
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
    margin: 0;
}
</style>
