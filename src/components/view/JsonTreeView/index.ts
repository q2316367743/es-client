/**
 * @name @ethicdevs/json-tree-view
 * @license MIT
 * @maintainer <William Nemencha, EthicDevs, https://github.com/EthicDevs/json-tree-view>
 * @forked-from <前端通過元素展示Json樹狀資料，因, https://github.com/yuda-lyu/w-jsonview-tree>
 * @itself-forked-from <沒有加入預先展開數據功能，自己下載來修改, https://github.com/pgrabovets/json-view>
 */

type JsonObject = Record<string | number, unknown>;

type JSONTreeNode = {
    key: null | string;
    parent: null | JSONTreeNode;
    value: null | string;
    expanded: boolean;
    type:
    | null
    | "array"
    | "string"
    | "number"
    | "bigint"
    | "boolean"
    | "symbol"
    | "undefined"
    | "object"
    | "function";
    children: null | JSONTreeNode[];
    elem: null | Element;
    depth: number;

    // Public methods API
    setCaretIconRight(): void;
    setCaretIconDown(): void;
    hideChildren(): void;
    showChildren(): void;
    toggle(): void;
};

/**
 * @export
 * @param {Object} jsonObj 輸入Json物件
 * @param {Element} rootElem 輸入初始化元素
 * @param options 选项
 */
export function renderJSONTreeView(
    jsonObj: JsonObject,
    rootElem: Element,
    options: {
        expanded?: boolean;
    } = {}
) {
    //default expanded
    let _expanded = false;

    function init() {
        //get expanded
        if (options) {
            _expanded = options["expanded"] === true;
        }

        //clear
        rootElem.innerHTML = "";

        //add class
        rootElem.classList.add("CompCssDJsonViewTree");

        //render
        let tree = createTree(jsonObj);
        render(tree, rootElem);
        return tree;
    }

    /**
     * Create html element
     * @param {String} type html element
     * @param {Object} config
     */
    function createElement(
        type: string,
        config?: {
            className?: null | string;
            content?: null | string;
            children?: null | Element[];
        }
    ) {
        let htmlElement = document.createElement(type);

        if (config === undefined) {
            return htmlElement;
        }

        if (config.className) {
            htmlElement.className = config.className;
        }

        if (config.content) {
            htmlElement.textContent = config.content;
        }

        if (config.children) {
            config.children.forEach((el) => {
                if (el !== null) {
                    htmlElement.appendChild(el);
                }
            });
        }

        return htmlElement;
    }

    function createExpandedElement(node: JSONTreeNode): HTMLElement {
        let iElem = createElement("i");

        if (node.expanded) {
            iElem.className = "wicon w-caret-down";
        } else {
            iElem.className = "wicon w-caret-right";
        }

        let caretElem = createElement("div", {
            className: "wjv-caret-icon",
            children: [iElem],
        });

        let handleClick = node.toggle.bind(node);
        caretElem.addEventListener("click", handleClick);

        let indexElem = createElement("div", {
            className: "hljs-index",
            content: node.key,
        });

        let typeElem = createElement("div", {
            className: "hljs-type",
            content: node.type,
        });

        let keyElem = createElement("div", {
            className: "hljs-attr",
            content: node.key,
        });

        let sizeElem = createElement("div", {
            className: "hljs-size",
        });

        if (node.type === "array") {
            sizeElem.innerText = "[" + node.children?.length + "]";
        } else if (node.type === "object") {
            sizeElem.innerText = "{" + node.children?.length + "}";
        }

        let lineChildren: any[];
        if (node.key === null) {
            lineChildren = [caretElem, typeElem, sizeElem];
        } else if (node?.parent?.type === "array") {
            lineChildren = [caretElem, indexElem, sizeElem];
        } else {
            lineChildren = [caretElem, keyElem, sizeElem];
        }

        let lineElem = createElement("div", {
            className: "wjv-line",
            children: lineChildren,
        });

        if (node.depth > 0) {
            //lineElem.style = 'margin-left: ' + node.depth * 24 + 'px;' //IE11 strict模式下無法指派, style為唯讀屬性
            lineElem.setAttribute("style", "margin-left: " + node.depth * 24 + "px;");
        }

        return lineElem;
    }

    /**
     * Create not expanded element
     * @param {Object} node
     * @return {HTMLElement}
     */
    function createNotExpandedElement(node: JSONTreeNode) {
        let caretElem = createElement("div", {
            className: "wjv-empty-icon",
        });
        let keyElem = createElement("div", {
            className: "hljs-attr",
            content: node.key,
        });
        let separatorElement = createElement("div", {
            className: "hljs-punctuation",
            content: ":",
        });
        let valueType = "hljs-" + typeof node.value;
        let valueContent = String(node.value);
        let valueElementName = typeof node.value==='string' ? 'pre' : "div";
        let valueElement = createElement(valueElementName, {
            className: "hljs-value " + valueType,
            content: valueContent,
        });
        let lineElem = createElement("div", {
            className: "wjv-line",
            children: [caretElem, keyElem, separatorElement, valueElement],
        });
        if (node.depth > 0) {
            //lineElem.style = 'margin-left: ' + node.depth * 24 + 'px;' //IE11 strict模式下無法指派, style為唯讀屬性
            lineElem.setAttribute("style", "margin-left: " + node.depth * 24 + "px;");
        }
        return lineElem;
    }

    /**
     * Create tree node
     * @return {Object}
     */
    function createNode(): JSONTreeNode {
        return {
            key: null,
            parent: null,
            value: null,
            expanded: _expanded,
            type: null,
            children: null,
            elem: null,
            depth: 0,

            setCaretIconRight() {
                let icon = this.elem?.querySelector(".wicon");
                icon?.classList.replace("w-caret-down", "w-caret-right");
            },

            setCaretIconDown() {
                let icon = this.elem?.querySelector(".wicon");
                icon?.classList.replace("w-caret-right", "w-caret-down");
            },

            hideChildren() {
                if (this.children !== null) {
                    this.children.forEach((item) => {
                        item.elem?.classList.add("hljs-hide");
                        if (item.expanded) {
                            item.hideChildren();
                        }
                    });
                }
            },

            showChildren() {
                if (this.children !== null) {
                    this.children.forEach((item) => {
                        item.elem?.classList.remove("hljs-hide");
                        if (item.expanded) {
                            item.showChildren();
                        }
                    });
                }
            },

            toggle: function () {
                if (this.expanded) {
                    this.expanded = false;
                    this.hideChildren();
                    this.setCaretIconRight();
                } else {
                    this.expanded = true;
                    this.showChildren();
                    this.setCaretIconDown();
                }
            },
        };
    }

    /**
     * Return variable type
     * @param {*} val
     */
    function getType(val: JsonObject): NonNullable<JSONTreeNode["type"]> {
        let type = typeof val;
        if (Array.isArray(val)) {
            type = "array" as never;
        } else if (val === null) {
            type = "null" as never;
        }
        return type;
    }

    /**
     * Recursively traverse json object
     * @param {Object} obj parsed json object
     * @param {Object} parent of object tree
     */
    function traverseObject(obj: JsonObject, parent: JSONTreeNode) {
        for (let key in obj) {
            let child = createNode();
            child.parent = parent;
            child.key = key;
            child.type = getType(obj[key] as never);
            child.depth = parent.depth + 1;
            child.expanded = _expanded;

            if (typeof obj[key] === "object") {
                child.children = [];
                if (parent.children == null) {
                    parent.children = [];
                }
                parent.children.push(child);
                traverseObject(obj[key] as JsonObject, child);
                child.elem = createExpandedElement(child);
            } else {
                child.value = obj[key] as never;
                child.elem = createNotExpandedElement(child);
                if (parent.children == null) {
                    parent.children = [];
                }
                parent.children.push(child);
            }
        }
    }

    /**
     * Create root of a tree
     * @param {Object} obj Json object
     * @return {Object}
     */
    function createTree(obj: JsonObject) {
        let tree = createNode();
        tree.type = getType(obj as never);
        tree.children = [];
        tree.expanded = _expanded;

        traverseObject(obj as never, tree);
        tree.elem = createExpandedElement(tree);

        return tree;
    }

    /**
     * Recursively traverse Tree object
     * @param node
     * @param callback
     */
    function traverseTree(
        node: JSONTreeNode,
        callback: (node: JSONTreeNode) => void
    ) {
        callback(node);
        if (node.children !== null) {
            node.children.forEach((item) => {
                traverseTree(item, callback);
            });
        }
    }

    /**
     * Render Tree object
     * @param {Object} tree
     * @param {String} rootElem
     */
    function render(tree: JSONTreeNode, rootElem: Element) {
        traverseTree(tree, (node) => {
            if (!node.expanded) {
                node.hideChildren();
            }
            if (node.elem) {
                rootElem.appendChild(node.elem);
            }
        });
    }

    return init();
}
