import {Input, Modal} from "@arco-design/web-vue";
import {h, VNode} from "vue";
import Optional from "@/utils/Optional";

export default {

    confirm(content: string, title: string, config: {
        confirmButtonText: string,
        cancelButtonText: string
    }): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Modal.confirm({
                content,
                title,
                draggable: true,
                okText: config.confirmButtonText,
                cancelText: config.cancelButtonText,
                onOk: () => {
                    resolve();
                },
                onCancel: () => {
                    reject('cancel');
                },
                onClose: () => {
                    reject('close');
                }
            })
        })
    },

    alert(content: string, title: string | null, config?: {
        confirmButtonText?: string,
        cancelButtonText?: string
    }): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Modal.confirm({
                content,
                title: Optional.ofNullable(title).orElse("警告"),
                draggable: true,
                okText: Optional.ofNullable(config).map(e => e?.confirmButtonText).orElse('确定'),
                cancelText: Optional.ofNullable(config).map(e => e?.cancelButtonText).orElse('取消'),
                onOk: () => {
                    resolve();
                },
                onCancel: () => {
                    reject('cancel');
                },
                onClose: () => {
                    reject('close');
                }
            })
        })
    },

    prompt(content: string, title: string, config: {
        confirmButtonText?: string,
        cancelButtonText?: string,
        inputPattern?: RegExp,
        inputErrorMessage?: string,
        inputValue?: string
    }): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let value = Optional.ofNullable(config.inputValue).orElse("") as string;
            const onInput = (e: string) => {
                value = e;
            }
            Modal.confirm({
                content: () => h('div', {class: 'es-prompt'}, [
                    h('div', {}, content),
                    // @ts-ignore
                    h(Input, {
                        type: 'text',
                        onInput,
                        "default-value": config.inputValue,
                        style: 'margin-top: 8px;',
                        onVnodeMounted: (e: VNode) => {
                            (e.el as HTMLInputElement)
                                .getElementsByTagName("input")
                                .item(0)!
                                .focus();
                        }
                    })
                ]),
                title: '提示',
                draggable: true,
                okText: config.confirmButtonText,
                cancelText: config.cancelButtonText,
                onOk: () => {
                    resolve(value);
                },
                onCancel: () => {
                    reject('cancel');
                },
                onClose: () => {
                    reject('close');
                }
            })
        })
    }

}