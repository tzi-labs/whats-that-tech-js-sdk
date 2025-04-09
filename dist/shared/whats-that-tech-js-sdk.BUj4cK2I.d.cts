interface DetectionDetails {
    [key: string]: boolean;
}
interface FrameworkInfo {
    name: string;
    version: string | null;
    vueVersion?: string | null;
    buildId?: string;
    reactVersion?: string;
}
interface ThemeInfo {
    name: string | null;
    version: string | null;
}
interface DetectionResult {
    name: string;
    categories: string[];
    detected: boolean;
    details?: DetectionDetails;
    framework?: FrameworkInfo;
    theme?: ThemeInfo;
}
declare global {
    interface Window {
        React?: {
            version?: string;
        };
        Vue?: {
            version?: string;
        };
        __VUE_DEVTOOLS_GLOBAL_HOOK__?: {
            Vue?: {
                version?: string;
            };
        };
        __NUXT__?: {
            version?: string;
        };
        __sveltekit?: {
            version?: string;
        };
        Shopify?: {
            theme?: {
                name?: string;
                id?: string;
                theme_store_id?: string;
                role?: string;
            };
        };
    }
}

export type { DetectionResult as D };
