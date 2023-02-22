import { commands, ExtensionContext, window } from "vscode";
import { EsClientPanel } from "./panels/EsClientPanel";
import { UrlTreeProvider } from "./panels/UrlTreeProvider";

export function activate(context: ExtensionContext) {
	// 创建打开es-client命令
	context.subscriptions.push(commands.registerCommand("es-client.command.open", () => {
		EsClientPanel.render(context.extensionUri);
	}));

	// 创建url打开命令
	context.subscriptions.push(commands.registerCommand('es-client-url.open', (args: string) => {
		console.log(args);
		EsClientPanel.sendUrlMessage('url-open', args, context.extensionUri);
	}))

	// 注册链接树提供程序
	window.registerTreeDataProvider("es-client-url", new UrlTreeProvider());

}