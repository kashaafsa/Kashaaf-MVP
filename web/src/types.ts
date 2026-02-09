export enum AnalysisStatus {
    IDLE = 'idle',
    EXTRACTING_FRAMES = 'extracting_frames',
    ANALYZING = 'analyzing',
    SUCCESS = 'success',
    ERROR = 'error',
}

export interface GameplayMetrics {
    reactionTimeScore: string;
    strategicDepth: string;
    executionAccuracy: string;
}

export interface KeyMoment {
    timestamp: string;
    description: string;
}

export interface AnalysisResult {
    gameplayMetrics: GameplayMetrics;
    title: string;
    summary: string;
    tacticalInsights: string[];
    proSuggestions: string[];
    performanceOptimization: string;
    keyMoments: KeyMoment[];
}
