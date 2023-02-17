import NativeStrategy from "@/strategy/NativeStrategy/NativeStrategy";
import {open} from "@tauri-apps/api/shell"

export default class TauriNativeStrategyImpl implements NativeStrategy {

    openLink(link: string): void {
        open(link).then(() => console.log("打开链接"))
    }

}