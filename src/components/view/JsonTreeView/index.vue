<template>
    <div class="data-scroll hljs" ref="el"/>
</template>
<script lang="ts">
import {defineComponent, onMounted, ref, watch} from "vue";
import {renderJSONTreeView} from "@/components/view/JsonTreeView/index";
import {jsonParse} from "@/algorithm/json";

export default defineComponent({
    name: 'json-tree-view',
    props: {
        value: [Object, String],
    },
    setup(props) {

        const el = ref();

        onMounted(() => {
            watch(() => props.value, value => {
                let json: Record<string, any> = {};
                if (value) {
                    if (typeof value === 'string') {
                        json = jsonParse(value);
                    }else {
                        json = value;
                    }
                }
                renderJSONTreeView(json, el.value, {
                    expanded: true
                });
            }, {immediate: true});
        })

        return {el}
    }
});
</script>
<style scoped>

</style>
