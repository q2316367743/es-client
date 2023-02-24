<template>
    <div class="entry">
        <div>
            <span>恭喜你成功更新到 </span>
            <span style="color: rgb(var(--arcoblue-6))">{{ version }}</span>
        </div>
        <div>本次更新如下</div>
        <update-item :log="log" />
    </div>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import Constant from "@/global/Constant";
import {LogItemEnum} from "@/view/Data";
import UpdateItem from "@/components/UpdateItem/index.vue";

export default defineComponent({
    name: 'version-update',
    components: {UpdateItem},
    data: () => ({
        version: Constant.version,
        log: Constant.logs[0]
    }),
});
</script>
<style scoped>

</style>