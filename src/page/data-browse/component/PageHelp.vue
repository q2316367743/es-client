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
<script lang="ts" setup>
import {computed} from "vue";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import {useDataBrowseStore} from "@/store/components/DataBrowseStore";
import {useDbConditionStore} from "@/page/data-browse/store/DbConditionStore";
import {useDbResultStore} from "@/page/data-browse/store/DbResultStore";

const {page, size} = useDbConditionStore();

const total = computed(() => useDbResultStore().total);

function update() {
    useDataBrowseStore().executeQuery(false);
}

function updatePage(value: number) {
    page.value = value;
}

function updateSize(value: number) {
    size.value = value;
}

function toFirst() {
    if (page.value === 1) {
        return;
    }
    updatePage(1);
    update();
}

function prePage() {
    if (page.value === 1) {
        return;
    }
    updatePage(page.value - 1);
    update();
}

function pageSizeChange(command: any) {
    pageSizeChangeExec(command, update, (p, s) => {
        updatePage(p);
        updateSize(s);
    })
}

function nextPage() {
    if (page.value * size.value > total.value) {
        return;
    }
    updatePage(page.value + 1);
    update();
}

function toLast() {
    updatePage(Math.ceil(total.value / size.value));
    update();
}

function pageSizeChangeExec(command: string, executeQuery: () => void, callback: (page: number, size: number) => void) {
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
                inputValue: size.value + ''
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
</script>
<style scoped>
.page-help {
    display: flex;
    margin: 0;
}
</style>
