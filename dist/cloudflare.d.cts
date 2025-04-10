import { D as DetectionResult } from './shared/whats-that-tech-js-sdk.BUj4cK2I.cjs';

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
}
declare function findTech(options: FindTechOptions, env: {
    MYBROWSER: any;
}): Promise<DetectionResult[]>;

export { findTech };
