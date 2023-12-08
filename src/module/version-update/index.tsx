import {showDialog} from "@/utils/DialogUtil";
import Constant from "@/global/Constant";
import UpdateItem from "@/components/update-item/index.vue";

export function showVersionUpdateDialog() {
    const log = Constant.logs[0];
    showDialog("版本更新", () =>
        <div class="entry">
            <div>
                <span>恭喜你成功更新到 </span>
                <span style="color: rgb(var(--arcoblue-6))">{Constant.version}</span>
            </div>
            <div>本次更新如下</div>
            <UpdateItem log={log}/>
        </div>, {
            width: "600px"
    })
}
