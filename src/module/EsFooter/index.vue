<template>
    <div id="footer">
        <div class="notification"></div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'EsFooter',
    data: () => ({
    
    }),
});
</script>
<style lang="less">
#footer {
    display: flex;
    justify-content: space-between;
    .notification {
        line-height: 20px;
        padding-left: 5px;
    }
}
</style>