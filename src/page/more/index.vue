<template>
    <div class="more">
        <a-scrollbar style="overflow: auto;height: calc(100vh - 47px);">
            <router-view/>
        </a-scrollbar>
    </div>
</template>

<script lang="ts" setup>
</script>

<style lang="less">
.more {
    position: absolute;
    top: 0;
    left: 7px;
    right: 7px;
    bottom: 7px;
    padding: 0;

}
</style>
