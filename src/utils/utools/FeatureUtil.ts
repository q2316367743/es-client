import Constant from "@/global/Constant";

/**
 * 关键字
 */
export interface Feature {
    code: string,
    explain: string,
    platform: FeaturePlatform | Array<FeaturePlatform>,
    icon?: string,
    cmds: Array<FeatureCmd>
}

/**
 * 可用平台
 */
export type FeaturePlatform = 'darwin' | 'win32' | 'linux';

/**
 * 关键字设置
 */
export interface FeatureCmd {
    type: FeatureCmdType,
    label: string,
    fileType?: FeatureCmdFileType,
    match? : string,
    minLength?: number
    maxLength?: number
}

export type FeatureCmdType = 'img' | 'files' | 'regex' | 'over' | 'window';

export type FeatureCmdFileType = 'file' | 'directory';

export function setFeatureOne(code: string, cmd: FeatureCmd): boolean {
    return utools.setFeature({
        code: code,
        explain: Constant.name,
        icon: "public/logo.png",
        platform: [
            "win32",
            "darwin",
            "linux"
        ],
        cmds: [cmd]
    });
}

/**
 * 根据Code获取唯一的feature
 * @param code feature的code
 */
export function getFeatureOne(code: string): Feature | null {
    const features = utools.getFeatures([code]);
    if (features.length === 0) {
        return null;
    }
    for (let feature of features) {
        if (feature.code === code) {
            // @ts-ignore
            return feature;
        }
    }
    return null;
}

export function removeFeatureOne(code: string): boolean {
    return utools.removeFeature(code);
}
