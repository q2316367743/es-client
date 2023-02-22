import { commands, ExtensionContext, window } from "vscode";
import { EsClientPanel } from "./panels/EsClientPanel";
import { UrlTreeProvider } from "./panels/UrlTreeProvider";

export function activate(context: ExtensionContext) {
	// 创建打开es-client命令
	context.subscriptions.push(commands.registerCommand("es-client.command.open", () => {
		EsClientPanel.render(context.extensionUri);
	}));

}