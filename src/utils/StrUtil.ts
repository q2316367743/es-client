export default {

    matchAll(str: string, regexes: Array<string>): boolean {
        for (let regex of regexes) {
            if (str.match(regex)) {
                return true;
            }
        }
        return false;
    }

}