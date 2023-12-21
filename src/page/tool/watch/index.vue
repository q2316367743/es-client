<template>
    <div class="watch abs-7">
        <a-card hoverable>
            <div style="display: flex;justify-content: space-between;">
                <a-input-group style="width: 50vw">
                    <a-select v-model="method" style="width: 100px">
                        <a-option v-for="method in signMethods">{{ method }}</a-option>
                    </a-select>
                    <a-auto-complete v-model="url" :data="data" allow-clear placeholder="请求链接" :loading="loading"/>
                </a-input-group>
                <a-button-group type="text">
                    <a-button v-if="isActive" @click="pause()">
                        <template #icon>
                            <icon-pause/>
                        </template>
                    </a-button>
                    <a-button v-else @click="start()" :disabled="url === ''">
                        <template #icon>
                            <icon-play-arrow/>
                        </template>
                    </a-button>
                    <a-dropdown>
                        <a-button :disabled="url === ''">
                            <a-progress type="circle" size="mini" status='warning' :percent="percent"/>
                        </a-button>
                        <template #content>
                            <a-doption @click="stop()">关闭</a-doption>
                            <a-doption @click="start(1000)">1s</a-doption>
                            <a-doption @click="start(5000)">5s</a-doption>
                            <a-doption @click="start(10000)">10s</a-doption>
                            <a-doption @click="start(30000)">30s</a-doption>
                        </template>
                    </a-dropdown>
                    <a-tooltip content="请求体" position="br">
                        <a-button @click="execShowBody()" :disabled="method === 'GET' || method === 'HEAD'">
                            <template #icon>
                                <icon-up v-if="showBody"/>
                                <icon-down v-else/>
                            </template>
                        </a-button>
                    </a-tooltip>
                </a-button-group>
            </div>
            <div v-show="showBody && method !== 'GET'&& method !== 'HEAD'" style="margin-top: 16px;">
                <monaco-editor v-model="body" language="json" height="400px"/>
            </div>
        </a-card>
        <a-card style="margin-top: 7px;" title="结果">
            <template #extra>
                <a-button type="text" :disabled="json.length === 0" @click="execCopy()">复制</a-button>
            </template>
            <pre class="hljs language-java" style="overflow-x: auto;overflow-y: hidden;font-size: 16px;line-height: 24px"
                 v-html="result"/>
        </a-card>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {Method} from "axios";
import {JSON_REGEX, signMethods, signs} from "@/data/EsUrl";
import useIndexStore from "@/store/IndexStore";
import {useIntervalFn} from "@vueuse/core";
import MonacoEditor from "@/components/monaco-editor/index.vue";
import {fetchEs, jsonParse} from "@/plugins/native/axios";
import useUrlStore from "@/store/UrlStore";
import MessageUtil from "@/utils/MessageUtil";
import {jsonToHtml} from "@/utils/DialogUtil";

const method = ref<Method>('POST');
const url = ref('');
const timer = ref(5);
const showBody = ref(true);
const body = ref("");
const result = ref("");
const json = ref("");
const loading = ref(false);
const run = ref(false);

const index = ref(0);

const data = computed(() => [
    ...useIndexStore().indices.flatMap(e => {
        return [
            `/${e.name}/_search`,
            ...e.alias.map(a => `/${a}/_search`)
        ]
    }),
    ...signs
]);
const percent = computed(() => Math.floor((timer.value - index.value) / timer.value * 100) / 100);

watch(() => run.value, () => showBody.value = false);


const {pause, resume, isActive} = useIntervalFn(() => {
    if (!run.value) {
        // 未启动
        return;
    }
    // 突然停止
    if (url.value.trim() === '') {
        stop();
        return;
    }
    if (useUrlStore().current === '') {
        stop();
        return;
    }
    // 倒计时
    if (index.value > 0) {
        index.value -= 1000;
        return;
    } else {
        //到0了
        index.value = timer.value;
    }
    if (showBody.value){
        showBody.value = false;
    }
    loading.value = true;
    fetchEs<string>({
        url: url.value,
        method: method.value,
        data: body.value,
        responseType: 'text'
    }).then(rsp => {
        if (JSON_REGEX.test(rsp)) {
            try {
                const {html, original} = jsonToHtml(jsonParse(rsp));
                result.value = html;
                json.value = original;
            } catch (e) {
                console.error(e);
            }
        } else {
            result.value = rsp;
        }
    }).catch(e => {
        MessageUtil.error("请求失败", e);
    }).finally(() => loading.value = false);
}, 1000, {immediate: false, immediateCallback: true});

function start(value?: number) {
    if (value) {
        timer.value = value;
    }
    index.value = timer.value;
    run.value = true;
    resume();
}

function stop() {
    index.value = timer.value;
    run.value = false;
    pause();
}

function execShowBody() {
    showBody.value = !showBody.value;
    if (showBody.value) {
        // 展开自动暂停
        pause();
    }
}

function execCopy() {
    utools.copyText(json.value);
    MessageUtil.success("已复制到剪贴板");
}

</script>
<style scoped>
.watch {
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
