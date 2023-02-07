<template>
    <el-form style="margin-top: 10px;" label-width="160px" label-position="top">
        <el-form-item label="类型">
            <el-radio-group v-model="syncSetting.type">
                <el-radio :label="SyncTypeEnum.DISABLE">禁用</el-radio>
                <el-radio :label="SyncTypeEnum.FILE">文件</el-radio>
                <el-radio :label="SyncTypeEnum.SERVER" disabled>服务器</el-radio>
                <el-radio :label="SyncTypeEnum.WEBDAV" disabled>WebDav</el-radio>
                <el-radio :label="SyncTypeEnum.SFTP" disabled>sftp</el-radio>
            </el-radio-group>
        </el-form-item>

        <!-- 同步模式 -->
        <el-form-item label="模式" v-if="syncSetting.type !== SyncTypeEnum.DISABLE">
            <el-radio-group v-model="syncSetting.mode">
                <el-radio :label="SyncModeEnum.COVER">覆盖</el-radio>
                <el-radio :label="SyncModeEnum.MIX">混合</el-radio>
            </el-radio-group>
        </el-form-item>

        <!-- 文件同步 -->
        <el-form-item label="操作" v-if="syncSetting.type === SyncTypeEnum.FILE">
            <el-upload
                class="upload"
                accept="json"
                action=""
                :before-upload="fileSyncUpload"
            >
                <el-button type="primary">同步</el-button>
            </el-upload>
            <el-button type="primary" @click="backup">备份</el-button>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {UploadFilled} from "@element-plus/icons-vue";
import {UploadRawFile} from "element-plus";

import SyncTypeEnum from "@/enumeration/SyncTypeEnum";
import SyncModeEnum from "@/enumeration/SyncModeEnum";

import Constant from "@/global/Constant";
import {syncStrategyContext,} from "@/global/BeanFactory";

import useSyncStore from "@/store/SyncSettingStore";

import SyncSetting from "@/domain/SyncSetting";

import MessageUtil from "@/utils/MessageUtil";

export default defineComponent({
    name: 'setting-sync',
    components: {UploadFilled},
    data: () => ({
        Constant,
        SyncTypeEnum,
        SyncModeEnum,
        syncSetting: {
            type: SyncTypeEnum.DISABLE
        } as SyncSetting,
        edit: false
    }),
    watch: {
        syncSetting: {
            handler(newValue: SyncSetting) {
                useSyncStore().setSync(newValue);
            },
            deep: true
        }
    },
    created() {
        this.syncSetting = useSyncStore().getSync;
    },
    methods: {
        // 文件同步上传文件
        fileSyncUpload(rawFile: UploadRawFile) {
            if (typeof FileReader !== 'undefined') {
                let fileReader = new FileReader();
                fileReader.readAsText(rawFile);
                fileReader.onload = (event: ProgressEvent<FileReader>) => {
                    if (event.target) {
                        let content = event.target.result as string;
                        syncStrategyContext.getStrategy(this.syncSetting.type).sync(JSON.parse(content)).then(() => {
                            MessageUtil.success('同步成功');
                        }).catch(e => MessageUtil.error('同步失败', e));
                    } else {
                        MessageUtil.error('文件读取失败');
                    }
                };
                fileReader.onerror = function (e: any) {
                    MessageUtil.error('同步失败', e);
                }
            } else {
                MessageUtil.error('文件读取器未定义');
            }
            return false;
        },
        async backup() {
            syncStrategyContext.getStrategy(this.syncSetting.type).backup()
                .then(() => MessageUtil.success("备份成功"))
                .catch(e => MessageUtil.error("备份失败", e));
        }
    }
});
</script>
<style scoped>
.upload {
    margin-top: 8px;
    margin-right: 12px;
}
</style>