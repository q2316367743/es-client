export interface SeniorSearchRequest {
    id: number;
    // 最大64
    name: string;
    // 最大255
    description: string;
}

export interface SeniorSearchRequestContent extends SeniorSearchRequest {
    method: string;
    url: string;
    body: string;
}

export function createSeniorSearchRequestContent(): SeniorSearchRequestContent {
    return {
        id: Date.now(),
        name: '',
        description: '',
        method: 'POST',
        url: '',
        body: ''
    }
}
