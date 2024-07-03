<template>
    <div class="data-scroll hljs" ref="el"/>
</template>
<script lang="ts">
import {defineComponent, onMounted, ref, watch} from "vue";
import {renderJSONTreeView} from "@/components/JsonTreeView/index";

export default defineComponent({
    name: 'json-tree-view',
    props: {
        value: Object,
    },
    setup(props) {

        const el = ref();

        onMounted(() => {
            watch(() => props.value, value => {
                renderJSONTreeView(value || {}, el.value, {
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
