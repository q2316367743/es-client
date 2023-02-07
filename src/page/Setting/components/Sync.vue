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
                <el-button type="primary">上传</el-button>
            </el-upload>
            <el-button type="primary" @click="fileSyncDownload">下载</el-button>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {UploadFilled} from "@element-plus/icons-vue";
import {ElLoading, UploadRawFile} from "element-plus";

import SyncTypeEnum from "@/enumeration/SyncTypeEnum";
import SyncModeEnum from "@/enumeration/SyncModeEnum";

import Constant from "@/global/Constant";
import {baseSearchHistoryService, seniorSearchHistoryService, urlService} from "@/global/BeanFactory";

import useSyncStore from "@/store/SyncSettingStore";

import SyncSetting from "@/domain/SyncSetting";

import BrowserUtil from "@/utils/BrowserUtil";
import MessageUtil from "@/utils/MessageUtil";

import SyncAlgorithm from "@/algorithm/SyncAlgorithm";

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
                fileReader.onload = function (event: ProgressEvent<FileReader>) {
                    if (event.target) {
                        let content = event.target.result as string;
                        let {url, baseSearchHistory, seniorSearchHistory} = JSON.parse(content);
                        SyncAlgorithm(url, baseSearchHistory, seniorSearchHistory).then(() => {
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
        async fileSyncDownload() {
            const loading = ElLoading.service({
                lock: true,
                text: '开始准备数据',
                background: 'rgba(0, 0, 0, 0.7)',
            });
            try {
                loading.setText('获取链接数据')
                let url = await urlService.list();
                loading.setText('获取基础搜索历史');
                let baseSearchHistory = await baseSearchHistoryService.list();
                loading.setText('获取高级搜索历史');
                let seniorSearchHistory = await seniorSearchHistoryService.list();
                loading.setText('开始下载');
                BrowserUtil.download(JSON.stringify({
                    url, baseSearchHistory, seniorSearchHistory
                }, null, 4), `数据备份下载-${new Date().getTime()}.json`, 'application/json');
            } catch (e: any) {
                MessageUtil.error('下载失败', e);
            } finally {
                loading.close();
            }
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