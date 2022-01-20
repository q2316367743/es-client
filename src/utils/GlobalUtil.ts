import _ from 'lodash';

let languages = ['zh', 'en'] as Array<string>;

export function getDefaultLanguage(): string {
    let language = 'zh';
    if (localStorage.getItem('language')) {
        let local = localStorage.getItem('language')!;
        if (_.findIndex(languages, e => e === local) > -1) {
            language = local;
        }
    }
    return language;
}