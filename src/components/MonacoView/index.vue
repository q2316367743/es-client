<template>
    <monaco-editor :model-value="pretty" language="json" :height="height" read-only/>
</template>
<script lang="ts">
import {defineComponent, ref, watch} from "vue";
import Optional from "@/utils/Optional";
import {jsonFormat} from "@/algorithm/jsonFormat";
import MonacoEditor from "@/components/monaco-editor/index.vue";
import TableViewer from "@/components/TableViewer/index.vue";


export default defineComponent({
    name: 'monaco-view',
    components: {TableViewer, MonacoEditor},
    props: {
        value: Object,
        height: String,
    },
    data: () => ({
        Optional,
    }),
    setup(props) {
        const pretty = ref('');


        watch(() => props.value, (value) => {
            if (value) {
                pretty.value = jsonFormat(value);
            } else {
                pretty.value = '{}';
            }
            if (pretty.value === '') {
                pretty.value = '{}';
            }
        }, {immediate: true, deep: true});

        return {pretty};

    }
});
</script>
<style lang="less">
</style>
