interface DetectedTechInfo {
    name: string;
    categories: string[];
}
interface FindTechOptions {
    url: string;
    timeout?: number;
    categories?: string[];
    excludeCategories?: string[];
    customFingerprintsFile?: string;
    onProgress?: (progress: {
        current: number;
        total: number;
        currentUrl: string;
        status: 'processing' | 'completed' | 'error';
        error?: string;
    }) => void;
    onTechDetected?: (result: DetectedTechInfo) => void;
}
declare function findTech(options: FindTechOptions, env: {
    MYBROWSER: any;
}): Promise<void>;

export { findTech };
export type { DetectedTechInfo };
