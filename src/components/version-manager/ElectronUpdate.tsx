import Constant from "@/global/Constant";
import PluginModeEnum from "@/enumeration/PluginModeEnum";
import {http} from "@/plugins/native/axios";
import {Modal, Tag, Typography, TypographyParagraph} from "@arco-design/web-vue";

interface UpdateInfo {

    sign: number;

    version: string;

    items: Array<string>;

    url: string;

}

/**
 * 检查electron版本更新
 */
export function checkElectronUpdate() {
    if (Constant.mode === PluginModeEnum.ELECTRON) {
        // 查询接口
        http<UpdateInfo>({
            method: 'GET',
            url: Constant.updateUrl,
        }).then(res => {
            const info = res.data;
            if (info.sign > Constant.sign) {
                Modal.open({
                    title: '检测到新版本',
                    content: () => <Typography>
                        <TypographyParagraph>
                            检测到新版本<Tag color={'arcoblue'}>{info.version}</Tag>，进行了如下更新：
                        </TypographyParagraph>
                        <TypographyParagraph>
                            <ol>
                                {info.items.map(i => <li>{i}</li>)}
                            </ol>
                        </TypographyParagraph>
                        <TypographyParagraph>
                            是否立即更新至新版本
                        </TypographyParagraph>
                    </Typography>,
                    okText: '前往下载',
                    onOk() {
                        utools.shellOpenExternal(info.url);
                    }
                })
            }
        })
    }
}
