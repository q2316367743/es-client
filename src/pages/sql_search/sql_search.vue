<template>
    <div class="sql-search">
        <div class="el-card condition is-always-shadow">
            <div class="el-card__header">
                <span>
                    <span>SQL查询</span>
                    <el-button
                        type="text"
                        style="margin-left: 10px"
                        @click="explain_dialog = true"
                    >?</el-button>
                </span>
                <el-button
                    style="
							float: right;
							padding: 3px 13px 3px 0;
							margin-left: 10px;
						"
                    type="text"
                    @click="is_show = !is_show"
                >{{ is_show ? "收起" : "展开" }}
                </el-button>
                <el-button
                    style="float: right; padding: 3px 0"
                    type="text"
                    @click="execute_query"
                >刷新
                </el-button>
                <el-button
                    style="float: right; padding: 3px 0"
                    type="text"
                    @click="show_query"
                >显示查询语句
                </el-button>
            </div>
            <div class="el-card__body" v-show="is_show">
                <codemirror v-model="sql" :options="options"></codemirror>
                <div class="option">
                    <el-button type="primary" @click="execute_query">执行</el-button>
                    <el-button type="success" @click="show_query">显示查询语句</el-button>
                    <el-button @click="sql = ''">清空</el-button>
                </div>
            </div>
        </div>
        <el-card class="result">
            <div slot="header">结果</div>
            <div>
                <json-viewer
                    :value="result"
                    :expand-depth="4"
                    copyable
                    sort
                ></json-viewer>
            </div>
        </el-card>
        <el-dialog
            title="查询条件"
            :visible.sync="condition_dialog"
            width="70%"
            append-to-body
            custom-class="es-dialog"
            :close-on-click-modal="false"
        >
            <json-viewer
                :value="condition_data"
                :expand-depth="4"
                copyable
                sort
            ></json-viewer>
        </el-dialog>
        <el-dialog
            title="说明"
            :visible.sync="explain_dialog"
            width="70%"
            append-to-body
            custom-class="es-dialog"
            :close-on-click-modal="false"
        >
            <p>目前仅支持select, from, where, and, order by, asc, desc, limit关键字，条件仅支持=</p>
            <h2 style="margin: 20px 10px">例如：</h2>
            <code>
                <pre>
select *
from javascript
where id = 1
and sex = 1
order by age desc
limit 0, 10
                </pre>
            </code>
        </el-dialog>
    </div>
</template>

<script>
import JsonViewer from "vue-json-viewer";
// 引入CodeMirror
import "codemirror/lib/codemirror.css";
// 引入主题后还需要在 options 中指定主题才会生效
import "codemirror/theme/idea.css";
// 语法高亮
import "codemirror/mode/sql/sql.js";

import axios from "axios";

import {convert} from '@/plugins/sql_convert'

export default {
    components: {
        JsonViewer
    },
    data: () => {
        return {
            sql: '',
            is_show: true,
            options: {
                tabSize: 4, // 缩进格式
                theme: "idea", // 主题，对应主题库 JS 需要提前引入
                lineNumbers: true, // 显示行号
                line: true,
                mode: "sql",
                smartIndent: true,
                styleActiveLine: true, // 高亮选中行
                showCursorWhenSelecting: true,
                hintOptions: {
                    completeSingle: true, // 当匹配只有一项的时候是否自动补全
                },
            },
            condition_data: {},
            condition_dialog: false,
            result: {},
            explain_dialog: false
        }
    },
    methods: {
        execute_query() {
            let body = convert(this.sql);
            axios({
                baseURL:
                    localStorage.getItem("url") + "/" + body.index + "/_search",
                method: "POST",
                data: body.condition,
            }).then((response) => {
                this.result = response.data;
            });
        },
        show_query() {
            let body = convert(this.sql);
            this.condition_data = body.condition;
            this.condition_dialog = true;
        }
    }
};
</script>

<style lang="less">
.sql-search {
    margin: 10px;

    .condition {
        .option {
            margin-top: 10px;
            width: 100%;
        }
    }

    .result {
        margin-top: 10px;
    }
}
</style>