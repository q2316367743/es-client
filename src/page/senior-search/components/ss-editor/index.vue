<template>
    <div class="senior-search-side">
        <!-- 编辑器 -->
        <div class="senior-search-editor">
            <!-- 操作栏 -->
            <ss-option :view="view" @save="save"
                                  @format-document="formatDocument" @clear-body="clearBody"
                                  @select="(command) => view = command">
                <template #footer>
                    <a-tooltip content="请求" position="right">
                        <a-button :type="editorVisible ? 'primary' : 'text'" status="normal"
                                  @click="editorVisible = true">
                            <template #icon>
                                <icon-list :size="18"/>
                            </template>
                        </a-button>
                    </a-tooltip>
                    <a-tooltip content="过滤" position="right">
                        <a-button :type="editorVisible ? 'text' : 'primary'" status="normal"
                                  @click="editorVisible = false">
                            <template #icon>
                                <icon-bug :size="18"/>
                            </template>
                        </a-button>
                    </a-tooltip>
                </template>
            </ss-option>
            <!-- rest客户端编辑器 -->
            <rest-client-editor ref="editorInstance" v-model="body" class="editor"
                                @execute="execute($event)"
                                v-show="editorVisible"/>
            <ss-filter-editor />
        </div>
    </div>
</template>
<script lang="ts" setup>
import {ref, watch} from "vue";
// 存储
import {useSeniorSearchStore} from "@/store/components/SeniorSearchStore";
// 组件
import RestClientEditor from "@/page/senior-search/components/rest-client-editor/index.vue";
import SsOption from "@/page/senior-search/components/ss-option/index.vue";
import SsFilterEditor from '@/page/senior-search/components/ss-filter-editor/index.vue';
// 其他
import ViewTypeEnum from "@/enumeration/ViewTypeEnum";
import formatBuild from "@/page/senior-search/build/FormatBuild";
import MessageUtil from "@/utils/MessageUtil";

const editorInstance = ref<any | null>(null)
const editorVisible = ref(true);
const body = ref(useSeniorSearchStore().body);
const view = ref<ViewTypeEnum>(ViewTypeEnum.JSON);


watch(() => body.value, value => useSeniorSearchStore().updateBody(value));
watch(() => useSeniorSearchStore().body, value => body.value = value);

const execute = (index: number) => useSeniorSearchStore().execute(index, editorInstance.value.getInstance());
const clearBody = () => useSeniorSearchStore().clearBody();
const save = () => useSeniorSearchStore().save();

function formatDocument() {
    try {
        body.value = formatBuild(editorInstance.value.getInstance());
    } catch (e: any) {
        MessageUtil.error('格式化失败', e);
    }
}

</script>
<style scoped>

</style>
