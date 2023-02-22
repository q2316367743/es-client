import { commands, ExtensionContext } from "vscode";
import { EsClientPanel } from "./panels/EsClientPanel";

export function activate(context: ExtensionContext) {
	// 创建打开es-client命令
	const showHelloWorldCommand = commands.registerCommand("es-client.command.open", () => {
		EsClientPanel.render(context.extensionUri);
	});

	// 将命令添加到扩展上下文
	context.subscriptions.push(showHelloWorldCommand);
}