import * as monaco from "monaco-editor";
import StrUtil from "@/utils/StrUtil";
import {supportMethods} from "@/data/EsUrl";

export default function formatBuild(instance: monaco.editor.IStandaloneCodeEditor): string {
    let value = instance.getValue();
    let items = Array<string>();
    for (let line of value.split('\n')) {
        line = line.replaceAll('\r', '');
        if (StrUtil.startWithArr(line, supportMethods)) {
            if (items.length > 0) {
                items.push('\n');
            }
            items.push(line);
        }else if (StrUtil.notBlank(line)) {
            items.push(line);
        }
    }
    console.log(items)
    return items.join('\n');
}