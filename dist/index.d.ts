import { D as DetectionResult } from './shared/whats-that-tech-js-sdk.BUj4cK2I.js';

interface FindTechOptions {
    url: string;
    headless?: boolean;
    timeout?: number;
    categories?: string[];
    excludeCategories?: string[];
    customFingerprintsDir?: string;
    customFingerprintsFile?: string;
    debug?: boolean;
    onProgress?: (progress: {
        current: number;
        total: number;
        currentUrl: string;
        status: 'processing' | 'completed' | 'error';
        error?: string;
    }) => void;
}
declare function findTech(options: FindTechOptions): Promise<DetectionResult[]>;

export { findTech };
