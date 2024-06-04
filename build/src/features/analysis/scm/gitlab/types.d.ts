import { z } from 'zod';
export declare const GitlabAuthResultZ: z.ZodObject<{
    access_token: z.ZodString;
    token_type: z.ZodString;
    refresh_token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    access_token: string;
    token_type: string;
    refresh_token: string;
}, {
    access_token: string;
    token_type: string;
    refresh_token: string;
}>;
export declare enum GitlabTokenRequestTypeEnum {
    CODE = "code",
    REFRESH_TOKEN = "refresh_token"
}
//# sourceMappingURL=types.d.ts.map