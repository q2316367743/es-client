<template>
    <el-form style="margin-top: 10px;" label-width="160px" label-position="top">
        <el-divider content-position="left">服务器设置</el-divider>
        <el-form-item label="模式">
            <el-radio-group v-model="serverSetting.mode">
                <el-radio :label="ServerModeEnum.CLIENT" :disabled="Constant.mode === 'server'">客户端模式</el-radio>
                <el-radio :label="ServerModeEnum.SERVER">服务器模式</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="服务器地址">
            <el-input style="width: 350px;" :disabled="serverSetting.mode === ServerModeEnum.CLIENT"
                      v-model="serverSetting.url"
                      placeholder="docker不需要填写"/>
        </el-form-item>
        <el-form-item label="token">
            <el-input style="width: 350px;" :disabled="serverSetting.mode === ServerModeEnum.CLIENT"
                      v-model="serverSetting.token"/>
        </el-form-item>
        <el-divider content-position="left">同步设置</el-divider>
        <el-form-item label="模式">
            <el-radio-group v-model="syncSetting.mode">
                <el-radio :label="SyncModeEnum.DISABLE">禁用</el-radio>
                <el-radio :label="SyncModeEnum.SERVER">服务器</el-radio>
                <el-radio :label="SyncModeEnum.FILE">文件</el-radio>
                <el-radio :label="SyncModeEnum.WEBDAV" disabled>WebDav</el-radio>
                <el-radio :label="SyncModeEnum.SFTP" disabled>sftp</el-radio>
            </el-radio-group>
        </el-form-item>

        <!-- 服务器同步 -->
        <el-form-item label="服务器地址"
                      v-if="syncSetting.mode === SyncModeEnum.SERVER && serverSetting.mode !== ServerModeEnum.SERVER">
            <el-input style="width: 350px;" v-model="syncSetting.server.url"
                      placeholder="docker不需要填写"/>
        </el-form-item>
        <el-form-item label="token"
                      v-if="syncSetting.mode === SyncModeEnum.SERVER && serverSetting.mode !== ServerModeEnum.SERVER">
            <el-input style="width: 350px;" v-model="syncSetting.server.token"/>
        </el-form-item>

        <!-- 文件同步 -->
        <el-form-item label="操作" v-if="syncSetting.mode === SyncModeEnum.FILE">
            <el-button type="success">上传</el-button>
            <el-button type="primary">下载</el-button>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import ServerModeEnum from "@/enumeration/ServerModeEnum";
import Constant from "@/global/Constant";
import useServerStore from "@/store/ServerSettingStore";
import ServerSetting from "@/entity/ServerSetting";
import SyncSetting from "@/entity/SyncSetting";
import SyncModeEnum from "@/enumeration/SyncModeEnum";
import useSyncStore from "@/store/SyncSettingStore";
import {ElNotification} from "element-plus";

export default defineComponent({
    name: 'setting-server-sync',
    data: () => ({
        Constant,
        ServerModeEnum,
        SyncModeEnum,
        serverSetting: {
            mode: ServerModeEnum.CLIENT,
            url: '',
            token: ''
        } as ServerSetting,
        syncSetting: {
            mode: SyncModeEnum.DISABLE
        } as SyncSetting,
        edit: false
    }),
    watch: {
        serverSetting() {
            this.edit = true
        }
    },
    created() {
        this.serverSetting = useServerStore().getServer;
        // 服务器模式需要处理
        if (Constant.mode === 'server') {
            // 如果是服务器模式，那么只能是服务器模式
            if (this.serverSetting.mode !== ServerModeEnum.SERVER) {
                // 发送通知
                ElNotification({
                    title: '警告',
                    message: '服务器安装，只能使用服务器模式',
                    type: 'warning',
                })
                useServerStore().setServerMode(ServerModeEnum.SERVER);
                this.serverSetting = useServerStore().getServer;
            }
        }
        this.syncSetting = useSyncStore().getSync;
    },
    methods: {
        saveServer() {
            useServerStore().setServer(this.serverSetting);
        }
    }
});
</script>
<style scoped>

</style>