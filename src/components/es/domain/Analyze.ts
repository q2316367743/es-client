export interface Analyze {
    tokens: Token[];
}

export interface Token {
    token: string;
    start_offset: number;
    end_offset: number;
    type: TokenType;
    position: number;
}

export type TokenType =  'word' | 'LETTER' | 'ENGLISH' | 'ARABIC' | '<ALPHANUM>' | '<NUM>';
