export interface SeniorSearchRequest {
    id: number;
    // 最大64
    name: string;
    // 最大255
    description: string;
    // 基础url，如果不一致，需要带上
    baseUrl: string;
    method: string;
    url: string;
    body: string;
}

export interface SeniorSearchRequestContent extends SeniorSearchRequest {
    body: string;
}
