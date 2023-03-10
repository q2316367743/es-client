import Optional from "@/utils/Optional";

export function getUrl(baseURL: string | undefined, url: string): string {
    baseURL = Optional.ofNullable(baseURL).orElse("");
    if (baseURL === '') {
        return url;
    }
    url = Optional.ofNullable(url).orElse("");
    if (baseURL.endsWith("/")) {
        baseURL = baseURL.substring(0, baseURL.length - 1);
    }
    if (!url.startsWith("/")) {
        url = `/${url}`;
    }
    return baseURL + url
}