<template>
    <div class="backup">
        <a-alert title="备份设置">通过WebDAV进行备份</a-alert>
        <a-alert style="margin-top: 14px;">恢复备份前请先备份当前数据，以免数据丢失</a-alert>
        <a-alert type="warning" v-if="disabledBackup" style="margin-top: 14px;">请先设置备份信息</a-alert>
        <a-button-group type="primary" style="margin-top: 14px;">
            <a-button @click="instance.visible = true;">设置备份信息</a-button>
            <a-button :disabled="disabledBackup" @click="execBackup()">执行备份</a-button>
            <a-button :disabled="disabledBackup" status="success" :loading="backup.loading" @click="loadFiles()">
                查看备份列表
            </a-button>
        </a-button-group>
        <a-modal v-model:visible="instance.visible" title="设置备份" ok-text="保存" @ok="save()"
                 :ok-loading="instance.loading" draggable>
            <a-form :model="instance" layout="vertical" style="margin-top: 7px;">
                <a-form-item label="服务器地址">
                    <a-input v-model="instance.record.url" allow-clear/>
                </a-form-item>
                <a-form-item label="用户名">
                    <a-input v-model="instance.record.username" allow-clearstyle="width: 400px;"/>
                </a-form-item>
                <a-form-item label="密码">
                    <a-input-password v-model="instance.record.password" allow-clear style="width: 400px;"/>
                </a-form-item>
            </a-form>
        </a-modal>
        <a-drawer title="备份列表" v-model:visible="backup.visible" ok-text="恢复" :width="400"
                  :ok-button-props="{disabled: backup.file === ''}" @ok="restore()">
            <a-radio-group v-model="backup.file" style="width: 368px;">
                <a-list>
                    <a-list-item v-for="file in backup.files">
                        <a-radio :value="file">{{ file }}</a-radio>
                        <template #extra>
                            <a-button type="text" status="danger" @click="deleteFile(file)">删除</a-button>
                        </template>
                    </a-list-item>
                </a-list>
            </a-radio-group>
        </a-drawer>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import {createClient, FileStat} from "webdav";
import {getDefaultBackupSetting, useBackupSettingStore} from "@/store/setting/BackupSettingStore";
import MessageUtil from "@/utils/MessageUtil";
import JSZip from "jszip";
import {pathJoin} from "@/utils/BrowserUtil";
import {useGlobalStore} from "@/store/GlobalStore";
import {toDateString} from "xe-utils";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {initData} from "@/global/BeanFactory";
import Constant from "@/global/Constant";


const FOLDER = Constant.name;
const FOLDER_PATH = '/' + FOLDER;

const notBackup = new Set<string>();
notBackup.add(LocalNameEnum.SETTING_BACKUP);
notBackup.add(LocalNameEnum.KEY_VERSION);

const instance = ref({
    visible: false,
    loading: false,
    record: getDefaultBackupSetting()
});
const backup = ref({
    visible: false,
    loading: false,
    files: new Array<string>(),
    file: ''
});
const disabledBackup = computed(() => instance.value.record.url === '' ||
    instance.value.record.username === '' ||
    instance.value.record.password === '');
const backupSetting = computed(() => useBackupSettingStore().backupSetting);
instance.value.record = Object.assign(instance.value.record, backupSetting.value);

function save() {
    instance.value.loading = true;
    useBackupSettingStore().save(instance.value.record)
        .then(() => MessageUtil.success("保存成功"))
        .catch(e => MessageUtil.error("保存失败", e))
        .finally(() => instance.value.loading = false);
}

function loadFiles() {
    backup.value.loading = true;
    backup.value.file = '';
    _loadFiles()
        .then(files => {
            backup.value.files = files;
            backup.value.visible = true;
        })
        .catch(e => MessageUtil.error("获取备份列表失败", e))
        .finally(() => backup.value.loading = false);
}

async function _loadFiles(): Promise<Array<string>> {
    const client = createClient(instance.value.record.url, {
        username: instance.value.record.username,
        password: instance.value.record.password,
    });

    // 先判断是否有这个目录
    let rootFiles = await client.getDirectoryContents("/") as Array<FileStat>;
    let needCreate = true;

    rootFiles.forEach(item => {
        if (item.basename === FOLDER) {
            needCreate = false;
        }
    })

    if (needCreate) {
        await client.createDirectory(FOLDER_PATH)
    }

    let files = await client.getDirectoryContents(FOLDER_PATH) as Array<FileStat>;
    return Promise.resolve(files
        .filter(e => e.type === 'file')
        .sort((a, b) => new Date(b.lastmod).getTime() - new Date(a.lastmod).getTime())
        .map(e => e.basename));
}

function execBackup() {
    useGlobalStore().startLoading("开始备份")
    backup.value.loading = true;
    _execBackup()
        .then(() => MessageUtil.success("备份成功"))
        .catch(e => MessageUtil.error("备份失败", e))
        .finally(() => {
            backup.value.loading = false;
            useGlobalStore().closeLoading();
        });
}

async function _execBackup() {
    const zip = new JSZip();
    const items = await utools.db.promises.allDocs();
    for (let item of items) {
        // 备份时，全部备份
        zip.file(item._id, JSON.stringify(item));
    }
    zip.generateAsync({type: "arraybuffer"}).then(function (content) {
        const client = createClient(instance.value.record.url, {
            username: instance.value.record.username,
            password: instance.value.record.password,
        });

        client.putFileContents(
            pathJoin(FOLDER_PATH, toDateString(new Date(), "yyyy-MM-dd_HH:mm:ss") + ".zip"),
            content)

    });
}

function deleteFile(name: string) {
    MessageBoxUtil.confirm("确认删除此备份？删除后将无法恢复", "删除备份警告", {
        confirmButtonText: "删除"
    }).then(() => _deleteFile(name)
        .then(() => {
            MessageUtil.success("删除备份成功");
            loadFiles();
        })
        .catch(e => MessageUtil.error("删除备份失败", e)));

}

async function _deleteFile(name: string) {
    const client = createClient(instance.value.record.url, {
        username: instance.value.record.username,
        password: instance.value.record.password,
    });
    await client.deleteFile(pathJoin(FOLDER_PATH, name));
}

function restore() {
    _restore()
        .then(() => {
            MessageUtil.success("恢复成功");
            // 重新初始化数据
            initData();
        })
        .catch(e => MessageUtil.error("恢复失败", e));
}

async function _restore(): Promise<void> {
    const client = createClient(instance.value.record.url, {
        username: instance.value.record.username,
        password: instance.value.record.password,
    });
    // 获取文件
    const res = await client.getFileContents(pathJoin(FOLDER_PATH, backup.value.file), {
        format: 'binary'
    }) as ArrayBuffer;
    const zip = await JSZip.loadAsync(res);

    // 删除当前存储
    const oldFiles = await utools.db.promises.allDocs();
    for (let oldFile of oldFiles) {
        if (notBackup.has(oldFile._id)) {
            continue;
        }
        // 删除时有选择删除
        await utools.db.promises.remove(oldFile._id);
    }

    return new Promise<void>(async resolve => {
        const len = Object.keys(zip.files).length;
        let index = 0;
        for (let path in zip.files) {
            if (notBackup.has(path)) {
                // 恢复时，有选择恢复
                index += 1;
                continue;
            }
            const file = zip.file(path);
            if (!file) {
                index += 1;
                continue;
            }
            const blob = await file.async('blob');
            const fileReader = new FileReader();

            fileReader.readAsText(blob, 'utf-8');

            fileReader.onload = async () => {
                index += 1;
                if (!fileReader.result) {
                    MessageUtil.warning("文件读取失败", path);
                    if (index >= len) {
                        resolve();
                    }
                    return;
                }
                await utools.db.promises.put({
                    _id: path,
                    value: JSON.parse(fileReader.result as string).value
                });
                if (index >= len) {
                    resolve();
                }
            }
        }
    })


    // 插入新的

}

</script>
<style scoped>
.backup {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 7px;
    overflow: auto;
}
</style>
