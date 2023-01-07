export default {

    matchAll(str: string, regexes: Array<string>): boolean {
        if (!regexes || regexes.length === 0 || !str || str === '') {
            return false;
        }
        for (let regex of regexes) {
            if (str.match(regex)) {
                return true;
            }
        }
        return false;
    }

}