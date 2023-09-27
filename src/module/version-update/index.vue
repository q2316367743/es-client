<template>
    <a-modal v-model:visible="dialog" :title="$t('app.versionUpdate')" mask-closable draggable lock-scroll
             width="600px">
        <div class="entry">
            <div>
                <span>恭喜你成功更新到 </span>
                <span style="color: rgb(var(--arcoblue-6))">{{ version }}</span>
            </div>
            <div>本次更新如下</div>
            <update-item :log="log"/>
        </div>
    </a-modal>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import Constant from "@/global/Constant";
import UpdateItem from "@/components/update-item/index.vue";

export default defineComponent({
    name: 'version-update',
    components: {UpdateItem},
    emits: ['update:visible'],
    props: {
        visible: Boolean
    },
    data: () => ({
        version: Constant.version,
        log: Constant.logs[0],
        dialog: false
    }),
    created() {
        this.dialog = this.visible
    },
    watch: {
        visible(newValue) {
            this.dialog = newValue;
        },
        dialog(newValue) {
            this.$emit('update:visible', newValue);
        }
    }
});
</script>
<style scoped>

</style>
