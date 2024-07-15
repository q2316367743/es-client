<template>
    <div class="senior-filter-record">

        <div class="header">
            <a-input v-model="keyword" style="width: 300px" placeholder="请输入名或者值" allow-clear/>
            <a-input-group>
                <a-switch type="round" v-model="enableFilter">
                    <template #checked>启用</template>
                    <template #unchecked>禁用</template>
                </a-switch>
                <a-button type="primary" @click="openAdd()">
                    <template #icon>
                        <icon-plus/>
                    </template>
                </a-button>
            </a-input-group>
        </div>

        <a-list :data="results" :virtual-list-props="virtualListProps" class="container">
            <template #item="{ item }">
                <a-list-item :key="item.id">
                    <a-list-item-meta :title="item.item.label" :description="item.item.value"/>
                    <template #extra>
                        <a-button-group type="text">
                            <a-button @click="openEdit(item.item)">
                                <template #icon>
                                    <icon-edit/>
                                </template>
                            </a-button>
                            <a-popconfirm content="删除后将无法恢复，确认删除？" @ok="remove(item.item.id)"
                                          :ok-button-props="{status: 'danger'}" ok-text="删除">
                                <a-button status="danger">
                                    <template #icon>
                                        <icon-delete/>
                                    </template>
                                </a-button>
                            </a-popconfirm>
                        </a-button-group>
                    </template>
                </a-list-item>
            </template>
        </a-list>
        <a-modal v-model:visible="seniorFilterRecord.visible" draggable
                 :title="(seniorFilterRecord.edit ? '修改' : '新增') + '高级查询过滤器'"
                 :ok-text="seniorFilterRecord.edit ? '修改' : '新增'"
                 :ok-button-props="{loading: seniorFilterRecord.loading}" @ok="add()">
            <a-form :model="seniorFilterRecord.record" layout="vertical">
                <a-form-item label="名称">
                    <a-input v-model="seniorFilterRecord.record.label"/>
                </a-form-item>
                <a-form-item label="内容">
                    <a-input v-model="seniorFilterRecord.record.value" placeholder="JS过滤">
                        <template #prepend>
                            this
                        </template>
                    </a-input>
                    <template #help>
                        示例 “.hiis.hits”、“.hiis.hits[0]”、“.hiis.hits.map(e => e._id)”
                    </template>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
import {useWindowSize} from "@vueuse/core";
import {computed, ref} from "vue";
import {useFuse} from "@vueuse/integrations/useFuse";
import MessageUtil from "@/utils/MessageUtil";
import {clone} from "xe-utils";
import {enableFilter, useSeniorFilterRecordStore} from "@/store/record/SeniorFilterRecordStore";
import {SeniorFilterRecord} from "@/entity/record/SeniorFilterRecord";

const size = useWindowSize();

const keyword = ref('');
const seniorFilterRecord = ref({
    visible: false,
    loading: false,
    edit: false,
    record: {
        id: 0,
        label: '',
        value: ''
    }
})
const virtualListProps = computed(() => ({
    height: size.height.value - 41 - 32 - 14 - 10
}));
const seniorFilterRecords = computed(() => useSeniorFilterRecordStore().seniorFilterRecords);

const {results} = useFuse(keyword, seniorFilterRecords, {
    matchAllWhenSearchEmpty: true,
    fuseOptions: {
        keys: [{
            name: 'label'
        }, {
            name: 'value'
        }]
    }
});

function openAdd() {
    seniorFilterRecord.value = {
        visible: true,
        loading: false,
        edit: false,
        record: {
            id: 0,
            label: '',
            value: ''
        }
    };
}

function openEdit(instance: SeniorFilterRecord) {
    seniorFilterRecord.value = {
        visible: true,
        loading: false,
        edit: true,
        record: clone(instance)
    };
}

function add() {
    if (seniorFilterRecord.value.edit) {
        // 编辑
        useSeniorFilterRecordStore().update(seniorFilterRecord.value.record)
            .then(() => MessageUtil.success("修改成功"))
            .catch(e => MessageUtil.error("修改失败", e));
    } else {
        useSeniorFilterRecordStore().add(seniorFilterRecord.value.record)
            .then(() => MessageUtil.success("新增成功"))
            .catch(e => MessageUtil.error("新增失败", e));
    }
}

function remove(id: number) {
    useSeniorFilterRecordStore().remove(id)
        .then(() => MessageUtil.success("删除成功"))
        .catch(e => MessageUtil.error("删除失败", e));
}

useSeniorFilterRecordStore().init();


</script>
<style lang="less">
.senior-filter-record {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .header {
        padding: 7px 0;
        display: flex;
        justify-content: space-between;
    }

}
</style>
