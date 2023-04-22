import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn, workspace } from "vscode";
import { getUri } from "../utils/getUri";

const cssList = ['index-e5b656aa.css'];
const jsPath = 'index-83afa9b6.js';
const moduleList = ['Optional-5aba4012.js',
    'MessageUtil-33058abc.js',
    'MessageBoxUtil-6ffabe7d.js',
    'BrowserUtil-d66fde57.js',
    'UrlStore-a1c26381.js'];


/**
 * 此类管理es-client Web视图面板的状态和行为。
 *
 * 它包含以下所有数据和方法：
 *
 * - 创建和渲染es-client Web视图面板
 * - 关闭面板时正确清理和处置webview资源
 * - 设置webview面板的HTML（以及代理CSS/JavaScript）内容
 * - 设置消息侦听器，以便在Web视图和扩展之间传递数据
 */
export class EsClientPanel {
    public static currentPanel: EsClientPanel | undefined;
    private readonly _panel: WebviewPanel;
    private _disposables: Disposable[] = [];

    /**
     * EsClientPanel类私有构造函数（仅从呈现方法调用）。
     *
     * @param panel 对webview面板的引用
     * @param extensionUri 包含扩展名的目录的URI
     */
    private constructor(panel: WebviewPanel, extensionUri: Uri) {
        this._panel = panel;

        // 设置一个事件侦听器，以便在释放面板时侦听（即，当用户关闭面板或以编程方式关闭面板时）
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // 设置Web视图面板的HTML内容
        this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);

    }

    /**
     * 关闭webview面板时，清理和处置webview资源。
     */
    public dispose() {
        EsClientPanel.currentPanel = undefined;

        // 处置当前webview面板
        this._panel.dispose();

        // 处置当前webview面板的所有可处置文件（即命令）
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    /**
     * 定义并返回应该在webview面板中呈现的HTML。
     *
     * @remarks 这也是创建Vue webview构建文件的引用并将其插入webview HTML的地方。
     *
     * @param webview 对扩展Web视图的引用
     * @param extensionUri 包含扩展名的目录的URI
     * @returns 包含HTML的模板字符串文本
     * 在webview面板中呈现
     */
    private _getWebviewContent(webview: Webview, extensionUri: Uri) {
        // Vue构建输出中的CSS文件
        const stylesUri = cssList.map(item => getUri(webview, extensionUri, ["es-client", "assets", item]))
            .map(item => `<link rel="stylesheet" href="${item}"`);
        // Vue构建输出中的JS文件
        const moduleUri = moduleList.map(item => getUri(webview, extensionUri, ["es-client", "assets", item]))
            .map(item => `<link rel="modulepreload" crossorigin href="${item}">`);

        // 提示：安装es6字符串html VS代码扩展以启用下面的代码突出显示
        return /*html*/ `
            <!DOCTYPE html>
            <html lang="zh">
            <head>
                <meta charset="UTF-8" />
                <link rel="icon" href="./logo.png" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>es-client</title>
                <script type="module" crossorigin src="${getUri(webview, extensionUri, ["es-client", "assets", jsPath])}"></script>
                ${moduleUri.join("\n")}
                ${stylesUri.join("\n")}
            </head>
            <body>
                <div id="app"></div>
            </body>
            </html>
            `;
    }

    /**
     * 如果当前webview面板存在，则呈现该面板，否则将创建并显示新的webview面板。
     *
     * @param extensionUri 包含扩展名的目录的URI。
     */
    public static render(extensionUri: Uri) {
        if (EsClientPanel.currentPanel) {
            // 如果webview面板已经存在，请将其显示出来
            EsClientPanel.currentPanel._panel.reveal(ViewColumn.One);
        } else {
            // If a webview panel does not already exist create and show a new one
            const panel = window.createWebviewPanel(
                // 面板视图类型
                "showEsClient",
                // 面板标题
                "es-client",
                // 显示面板的编辑器列
                ViewColumn.One,
                // 额外面板配置
                {
                    // 在Web视图中启用JavaScript
                    enableScripts: true,
                    // webview被隐藏时保持状态，避免被重置
                    retainContextWhenHidden: true,
                    // 限制webview仅从“es-client”目录加载资源
                    localResourceRoots: [Uri.joinPath(extensionUri, "es-client")],
                }
            );

            EsClientPanel.currentPanel = new EsClientPanel(panel, extensionUri);
        }
    }

}