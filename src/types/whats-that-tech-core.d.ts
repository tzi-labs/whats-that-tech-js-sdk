import { 
  Fingerprint,
  DetectionResult,
  DetectionDetails,
  FrameworkInfo,
  ThemeInfo
} from './tech-detection';

declare module 'whats-that-tech-core' {
  const coreFingerprints: Fingerprint;
  export default coreFingerprints;
  
  export type {
    Fingerprint,
    DetectionResult,
    DetectionDetails,
    FrameworkInfo,
    ThemeInfo
  };
} 