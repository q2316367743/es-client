<template>
    <pre>{{ pretty }}</pre>
</template>
<script lang="ts">
import {defineComponent, ref, watch} from "vue";
import Optional from "@/utils/Optional";
import {jsonFormat} from "@/algorithm/json";


export default defineComponent({
    name: 'base-view',
    props: {
        value: [Object, String]
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
