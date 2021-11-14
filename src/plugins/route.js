/**
 * 路由管理
 */

export function get_current_route() {
    let href = window.location.href;
    let url = href.split('#');
    let path = "home";
    if (url.length > 1) {
        path = url[1];
    }
    window.location.href = url[0] + '#' + path;
    return path;
}

export function choose_route(route, callback) {
    let href = window.location.href;
    let url = href.split('#');
    window.location.href = url[0] + '#' + route;
    callback()
}

export function check_route(route) {
    let href = window.location.href;
    let url = href.split('#');
    if (url.length > 1) {
        return url[1] === route;
    }
    return false;
}