import {Input, Modal} from "@arco-design/web-vue";
import Optional from "@/utils/Optional";


interface PromptOption {
    confirmButtonText: string,
    cancelButtonText: string,
    inputPattern: RegExp,
    inputErrorMessage: string,
    inputValue: string
}

export default {

    confirm(content: string, title: string, config?: {
        confirmButtonText?: string,
        cancelButtonText?: string
    }): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Modal.confirm({
                content,
                title,
                draggable: true,
                okText: config ? config.confirmButtonText : undefined,
                cancelText: config ? config.cancelButtonText : undefined,
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
                okText: Optional.ofNullable(config).map(e => e.confirmButtonText).orElse('确定'),
                cancelText: Optional.ofNullable(config).map(e => e.cancelButtonText).orElse('取消'),
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

    prompt(content: string, title: string, config?: Partial<PromptOption>): Promise<string> {
        const option = config || {}
        return new Promise<string>((resolve, reject) => {
            let value = Optional.ofNullable(option).map(e => e.inputValue).orElse("");
            const onInput = (e: string) => {
                value = e;
            }
            Modal.confirm({
                content: () => <div class="domain-prompt">
                    <div>{content}</div>
                    <Input type="text" defaultValue={option.inputValue} onInput={e => onInput(e)}
                           style={{marginTop: '8px'}} onVnodeMounted={e => (e.el as HTMLInputElement)
                        .getElementsByTagName("input")
                        .item(0)!
                        .focus()}/>
                </div>,
                title: title,
                draggable: true,
                okText: option.confirmButtonText,
                cancelText: option.cancelButtonText,
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
    },

    password(content: string, title: string, config?: Partial<PromptOption>): Promise<{
        username: string;
        password: string;
    }> {
        const option = config || {}
        return new Promise<{
            username: string;
            password: string;
        }>((resolve, reject) => {
            let value = {
                username: '',
                password: ''
            };
            const onUsernameInput = (e: string) => {
                value.username = e;
            }
            const onPasswordInput = (e: string) => {
                value.username = e;
            }
            Modal.confirm({
                content: () => <div class="domain-prompt">
                    <div>{content}</div>
                    <Input type="text" onInput={e => onUsernameInput(e)} style={{marginTop: '8px'}}
                           onVnodeMounted={e => {
                               (e.el as HTMLInputElement)
                                   .getElementsByTagName("input")
                                   .item(0)!
                                   .focus();
                           }}/>
                    <Input type="password" onInput={e => onPasswordInput(e)} style={{marginTop: '8px'}}/>
                </div>,
                title: title,
                draggable: true,
                okText: option.confirmButtonText,
                cancelText: option.cancelButtonText,
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
