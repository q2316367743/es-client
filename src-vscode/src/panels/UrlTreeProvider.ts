import {CancellationToken, Event, ProviderResult, TreeDataProvider, TreeItem} from 'vscode';

export class UrlTreeProvider implements TreeDataProvider<UrlItem> {


    onDidChangeTreeData?: Event<void | UrlItem | UrlItem[] | null | undefined> | undefined;

    getTreeItem(element: UrlItem): TreeItem | Thenable<TreeItem> {
        return element;
    }
    getChildren(element?: UrlItem | undefined): ProviderResult<UrlItem[]> {
        return [{
            id: "0",
            label: "本地",
            command: {
                title: "打开本地",
                command: "es-client-url.open",
                arguments: ['1']
            }
        }];
    }
    getParent?(element: UrlItem): ProviderResult<UrlItem> {
        throw new Error('Method not implemented.');
    }
    resolveTreeItem?(item: TreeItem, element: UrlItem, token: CancellationToken): ProviderResult<TreeItem> {
        throw new Error('Method not implemented.');
    }

}


export interface UrlItem extends TreeItem {

}