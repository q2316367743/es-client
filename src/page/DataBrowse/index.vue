<template>
    <div id="data-browse">
        <div class="option">
            <div class="left">
                <div class="item" :class="page === 1 ? 'disable' : ''" @click="toFirst">
                    <i class="vxe-icon-arrow-double-left" />
                </div>
                <div class="item" :class="page === 1 ? 'disable' : ''" @click="prePage">
                    <i class="vxe-icon-arrow-left" />
                </div>
                <el-dropdown trigger="click" @command="pageSizeChange">
                    <div class="item" style="font-size: 12px;line-height: 20px;">
                        {{ (page - 1) * size }} - {{ (Math.min(page * size, count)) }}
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="1">10</el-dropdown-item>
                            <el-dropdown-item command="2">100</el-dropdown-item>
                            <el-dropdown-item command="3">250</el-dropdown-item>
                            <el-dropdown-item command="4">500</el-dropdown-item>
                            <el-dropdown-item command="5">1,000</el-dropdown-item>
                            <el-dropdown-item command="6">自定义</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <div class="item" style="font-size: 12px">
                    / {{ count }}
                </div>
                <div class="item" :class="page * size > count ? 'disable' : ''" @click="nextPage">
                    <i class="vxe-icon-arrow-right" />
                </div>
                <div class="item" :class="page * size > count ? 'disable' : ''" @click="toLast">
                    <i class="vxe-icon-arrow-double-right" />
                </div>
                <div class="sep"></div>
                <div class="item" @click="executeQuery">
                    <i class="vxe-icon-refresh" />
                </div>
                <div class="sep"></div>
                <div class="item">
                    <i class="vxe-icon-add" />
                </div>
                <div class="item">
                    <i class="vxe-icon-minus" />
                </div>
                <div class="item">
                    <i class="vxe-icon-indicator" />
                </div>
                <div class="item" style="font-size: 14px">
                    <i class="vxe-icon-eye-fill" />
                </div>
                <div class="item">
                    <i class="vxe-icon-save" />
                </div>
            </div>
            <div class="right">
                <el-popover placement="bottom" :width="400" trigger="click" :visible="visible">
                    <template #reference>
                        <div class="item" style="display: flex;" @click="visible = !visible;">
                            <div v-if="index === ''">未选择索引</div>
                            <div v-else>{{ index }}</div>
                            <el-icon :size="20" style="margin: 2px;">
                                <arrow-down v-if="visible" />
                                <arrow-up v-else />
                            </el-icon>
                        </div>
                    </template>
                    <el-scrollbar height="400px">
                        <div v-for="index in indices" :command="index.name" class="data-browse-list-item"
                            @click="indexChange(index.name)">
                            <span>{{ index.name }}</span>
                            <span v-if="index.alias && index.alias.length > 0">
                                <el-tag v-for="alias in index.alias">{{ alias }}</el-tag>
                            </span>
                        </div>
                    </el-scrollbar>
                </el-popover>
                <div class="item">
                    <el-icon>
                        <Download />
                    </el-icon>
                </div>
                <el-dropdown trigger="click" @command="viewChange">
                    <div class="item">
                        <el-icon>
                            <View />
                        </el-icon>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="1">
                                <el-icon v-if="view === '1'">
                                    <Check />
                                </el-icon>
                                <span>表格</span>
                            </el-dropdown-item>
                            <el-dropdown-item command="2">
                                <el-icon v-if="view === '2'">
                                    <Check />
                                </el-icon>
                                <span>JSON</span>
                            </el-dropdown-item>
                            <el-dropdown-item command="3">
                                <el-icon v-if="view === '3'">
                                    <Check />
                                </el-icon>
                                <span>编辑器</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <div class="item">
                    <el-icon>
                        <Operation />
                    </el-icon>
                </div>
            </div>
        </div>
        <div class="condition"></div>
        <div class="content"></div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from 'pinia';
import { ElMessageBox } from "element-plus";

import { VxeTablePropTypes, VxeColumnPropTypes, VxeTableDefines } from 'vxe-table'
import XEUtils from 'xe-utils';

import { ArrowDown, ArrowUp, Operation, Download, View, Check } from "@element-plus/icons-vue";

import useIndexStore from "@/store/IndexStore";
import useSettingStore from "@/store/SettingStore";


export default defineComponent({
    name: 'data-browse',
    components: {
        ArrowDown, ArrowUp, Operation, Download, View, Check
    },
    computed: {
        ...mapState(useIndexStore, ['indices']),
    },
    data: () => ({
        page: 1,
        size: useSettingStore().getPageSize,
        count: 1,
        index: '',
        visible: false,
        view: '1'
    }),
    methods: {
        executeQuery() { },
        // >----------------------------------- 上面按钮 ---------------------------------->
        toFirst() {
            if (this.page === 1) {
                return;
            }
            this.page = 1;
            this.executeQuery()
        },
        prePage() {
            if (this.page === 1) {
                return;
            }
            this.page -= 1;
            this.executeQuery()
        },
        pageSizeChange(command: string) {
            switch (command) {
                case "1":
                    this.size = 10;
                    this.page = 1;
                    this.executeQuery();
                    break;
                case "2":
                    this.size = 100;
                    this.page = 1;
                    this.executeQuery();
                    break;
                case "3":
                    this.size = 250;
                    this.page = 1;
                    this.executeQuery();
                    break;
                case "4":
                    this.size = 500;
                    this.page = 1;
                    this.executeQuery();
                    break;
                case "5":
                    this.size = 1000;
                    this.page = 1;
                    this.executeQuery();
                    break;
                case "6":
                    ElMessageBox.prompt('请输入自定义分页大小', '自定义分页', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        inputPattern: /\d+/,
                        inputErrorMessage: '请输入正确的数字',
                    })
                        .then(({ value }) => {
                            this.size = parseInt(value);
                            this.page = 1;
                            this.executeQuery();
                        })
                        .catch(() => {
                        });
                    break
            }
        },
        nextPage() {
            if (this.page * this.size > this.count) {
                return;
            }
            this.page += 1;
            this.executeQuery();
        },
        toLast() {
            this.page = Math.ceil(this.count / this.size)
            this.executeQuery();
        },
        indexChange(command: string) {
            this.index = command;
            this.visible = false;
        },
        viewChange(command: string) {
            this.view = command
        }
        // <----------------------------------------- 上面按钮 -----------------------------------------<
    }
});
</script>
<style lang="less">
#data-browse {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 1px solid #e4e7ed;

    .option {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 25px;
        border-bottom: 1px solid #e4e7ed;
        display: flex;
        justify-content: space-between;

        .left {
            display: flex;
        }

        .right {
            display: flex;
        }


        .item {
            padding: 1px 5px;
            line-height: 23px !important;
            cursor: pointer;

            &:hover {
                border: 1px solid #f2f2f2;
                padding: 0 4px;
            }

            &.disable {
                color: #f2f2f2;

                &:hover {
                    border: 1px solid #ffffff;
                }
            }
        }

    }

    .condition {
        position: absolute;
        top: 26px;
        left: 0;
        right: 0;
        height: 30px;
        border-bottom: 1px solid #e4e7ed;
    }

    .content {
        position: absolute;
        top: 55px;
        left: 0;
        right: 0;
        bottom: 0;
    }
}

.data-browse-list-item {
    width: 374px;
    display: flex;
    justify-content: space-between;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #f2f2f2;
    cursor: pointer;

    &:hover {
        background-color: #f2f2f2;
    }
}
</style>