<template>
    <div class="display-history">
        <header class="header">
            <a-input allow-clear v-model="keyword" placeholder="请输入记录名"/>
        </header>
        <a-list :data="results" :bordered="false" :virtual-list-props="virtualListProps">
            <template #item="{ item, index }">
                <a-list-item :key="item.item.id">
                    <a-link @click="load(item.item.id)">{{ item.item.name }}</a-link>
                    <template #extra>
                        <a-button-group type="text">
                            <a-tooltip content="载入">
                                <a-button status="success" @click="load(item.item.id)" style="border: none;">
                                    <template #icon>
                                        <icon-import/>
                                    </template>
                                </a-button>
                            </a-tooltip>
                            <a-tooltip content="重命名">
                                <a-button @click="rename(item.item.id, item.item.name)">
                                    <template #icon>
                                        <icon-edit/>
                                    </template>
                                </a-button>
                            </a-tooltip>
                            <a-popconfirm content="是否删除此条记录？" ok-text="删除" :ok-button-props="{status: 'danger'}"
                                          @ok="remove(item.item.id)">
                                <a-button status="danger">
                                    <template #icon>
                                        <icon-delete/>
                                    </template>
                                </a-button>
                            </a-popconfirm>
                        </a-button-group>
                    </template>
                </a-list-item>
            </template>
        </a-list>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import {useSeniorSearchHistoryStore} from "@/store/history/SeniorSearchHistoryStore";
import {useFuse} from "@vueuse/integrations/useFuse";
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import MessageUtil from "@/utils/MessageUtil";
import {useWindowSize} from "@vueuse/core";

const size = useWindowSize();

const keyword = ref('');
const items = computed(() => useSeniorSearchHistoryStore().seniorSearchHistories);
const {results} = useFuse(keyword, useSeniorSearchHistoryStore().seniorSearchHistories, {
    matchAllWhenSearchEmpty: true,
    fuseOptions: {
        keys: [{
            name: 'name'
        }]
    }
});
const virtualListProps = computed(() => ({
    height: size.height.value - 41 - 32 - 14 - 14 - 32 - 7
}))

const load = (id: number) => useSeniorSearchStore().loadHistory(id);
const rename = (id: number, name: string) => {
    MessageBoxUtil.prompt("请输入新的名称", "重命名", {
        confirmButtonText: "更新",
        inputValue: name
    }).then(text => {
        useSeniorSearchHistoryStore().rename(id, text)
            .then(() => MessageUtil.success("重命名成功"))
            .catch(e => MessageUtil.error("重命名失败", e));
    })
}
const remove = (id: number) => useSeniorSearchHistoryStore().remove(id)
    .then(() => MessageUtil.success("删除成功"))
    .catch(e => MessageUtil.error("删除失败", e));

</script>
<style scoped>

</style>
