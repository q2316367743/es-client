import WindowShow from "@/strategy/WindowStrategy/WindowShow";
import Constant from "@/global/Constant";

export default function WindowStrategyUtil(): WindowShow {
    if (Constant.platform === 'ts') {
        return {visibility: true, close: true, max: true, min: true};
    } else if (Constant.platform === 'utools') {
        return {visibility: false, close: true, max: false, min: true};
    } else if (Constant.mode === 'desktop') {
        return {visibility: true, close: true, max: true, min: true};
    } else {
        return {visibility: false, close: false, max: true, min: false};
    }
}