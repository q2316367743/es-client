/**
 * 路由管理
 */

/**
 * 获取当前路由
 * 
 * @returns 当前路由
 */
export function get_current_route(): string {
    let href = window.location.href;
    let url = href.split('#');
    let path = "home";
    if (url.length > 1) {
        path = url[1];
    }
    window.location.href = url[0] + '#' + path;
    return path;
}

/**
 * 切换路由
 * 
 * @param route 路由
 */
export function choose_route(route: string) {
    let href = window.location.href;
    let url = href.split('#');
    window.location.href = url[0] + '#' + route;
}

/**
 * 检查当前路由是否是指定路由
 * 
 * @param route 路由
 * @returns 当前路由是否是指定路由
 */
export function check_route(route: string): boolean {
    let href = window.location.href;
    let url = href.split('#');
    if (url.length > 1) {
        return url[1] === route;
    }
    return false;
}