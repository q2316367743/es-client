<template>
    <div class="more">
        <router-view/>
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
    overflow: auto;
}
</style>
