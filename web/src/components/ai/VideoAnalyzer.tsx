import React, { useState, useRef } from 'react';
import { AnalysisStatus, AnalysisResult } from '@/types';
import { analyzeVideo } from '@/services/geminiService';
import AnalysisDisplay from '@/components/ai/AnalysisDisplay';

const VideoAnalyzer: React.FC = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [progress, setProgress] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (videoUrl) URL.revokeObjectURL(videoUrl);
            setVideoFile(file);
            setVideoUrl(URL.createObjectURL(file));
            setStatus(AnalysisStatus.IDLE);
            setResult(null);
            setErrorMessage(null);
        }
    };

    const startAnalysis = async () => {
        if (!videoFile || !videoRef.current) return;

        try {
            setStatus(AnalysisStatus.EXTRACTING_FRAMES);
            setProgress(10);

            const frames = await extractFrames(videoRef.current, 12); // Slightly more frames for detailed gameplay
            setProgress(40);

            setStatus(AnalysisStatus.ANALYZING);
            const analysis = await analyzeVideo(frames);

            setResult(analysis);
            setStatus(AnalysisStatus.SUCCESS);
            setProgress(100);
        } catch (error: any) {
            console.error(error);
            setErrorMessage(error.message || "The AI coach encountered a tactical error. Please try again.");
            setStatus(AnalysisStatus.ERROR);
        }
    };

    const extractFrames = async (video: HTMLVideoElement, frameCount: number): Promise<string[]> => {
        const frames: string[] = [];
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const duration = video.duration;

        if (!ctx) throw new Error("Could not initialize canvas context");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        for (let i = 0; i < frameCount; i++) {
            const time = (duration / frameCount) * i;
            video.currentTime = time;

            // Wait for seek properly
            await new Promise<void>((resolve) => {
                const onSeeked = () => {
                    // Ensure we only listen once
                    video.removeEventListener('seeked', onSeeked);
                    resolve();
                };
                video.addEventListener('seeked', onSeeked);
                // Trigger seek if not already matching (though setting currentTime usually triggers it, 
                // sometimes immediate checks are needed or loops can be fast)
            });

            // Draw 
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            frames.push(canvas.toDataURL('image/jpeg', 0.6).split(',')[1]);

            setProgress(10 + Math.floor((i / frameCount) * 30));
        }

        return frames;
    };

    const reset = () => {
        setVideoFile(null);
        if (videoUrl) URL.revokeObjectURL(videoUrl);
        setVideoUrl(null);
        setStatus(AnalysisStatus.IDLE);
        setResult(null);
        setErrorMessage(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-4xl font-black text-white mb-4 tracking-tight uppercase">
                    Kashaaf <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">AI Lab</span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                    Upload your Gameplay to receive elite coaching, tactical insights, and performance optimization reports powered by Gemini.
                </p>
            </div>

            {!videoUrl ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative h-96 border-2 border-dashed border-slate-800 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500/50 hover:bg-slate-900/30 transition-all overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 group-hover:scale-110 group-hover:border-cyan-500/50 transition-all mb-6 relative">
                        <i className="fa-solid fa-gamepad text-3xl text-slate-500 group-hover:text-cyan-400"></i>
                    </div>

                    <h3 className="text-xl font-bold text-slate-200 mb-2 tracking-wide uppercase">Deploy Gameplay</h3>
                    <p className="text-slate-500 text-sm">Level up your game with elite coaching, tactical insights, and performance optimization reports .</p>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="video/*"
                        className="hidden"
                    />
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        <div className="space-y-6">
                            <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="px-2 py-1 bg-rose-500 text-white text-[10px] font-black uppercase rounded flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> REC FEED
                                    </span>
                                </div>
                                <video
                                    ref={videoRef}
                                    src={videoUrl}
                                    controls
                                    className="w-full aspect-video bg-black"
                                />
                            </div>

                            <div className="flex gap-4">
                                {status === AnalysisStatus.IDLE && (
                                    <button
                                        onClick={startAnalysis}
                                        className="flex-grow py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        <i className="fa-solid fa-brain"></i>
                                        Analyze Mechanics
                                    </button>
                                )}

                                {(status === AnalysisStatus.EXTRACTING_FRAMES || status === AnalysisStatus.ANALYZING) && (
                                    <div className="flex-grow bg-slate-900 rounded-2xl border border-slate-800 p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">
                                                {status === AnalysisStatus.EXTRACTING_FRAMES ? 'Scanning HUD & Geometry...' : 'Compiling Pro Report...'}
                                            </span>
                                            <span className="text-xs font-mono text-slate-500">{progress}%</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-cyan-500 transition-all duration-500"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {status === AnalysisStatus.SUCCESS && (
                                    <button
                                        onClick={reset}
                                        className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all border border-slate-700"
                                    >
                                        Start Over
                                    </button>
                                )}

                                {status === AnalysisStatus.ERROR && (
                                    <button
                                        onClick={startAnalysis}
                                        className="flex-grow py-4 bg-rose-500/20 border border-rose-500/50 text-rose-500 font-bold rounded-2xl transition-all"
                                    >
                                        Recalibrate AI
                                    </button>
                                )}

                                {status === AnalysisStatus.IDLE && (
                                    <button
                                        onClick={reset}
                                        className="px-6 py-4 bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold rounded-2xl border border-slate-800 transition-all"
                                    >
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                )}
                            </div>

                            {errorMessage && (
                                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex gap-3 text-rose-400">
                                    <i className="fa-solid fa-triangle-exclamation mt-1"></i>
                                    <p className="text-sm font-medium">{errorMessage}</p>
                                </div>
                            )}
                        </div>

                        <div className="min-h-[400px]">
                            {status === AnalysisStatus.IDLE && (
                                <div className="h-full glass-panel rounded-3xl border border-slate-800 border-dashed p-12 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-6 text-slate-700 border border-slate-800">
                                        <i className="fa-solid fa-microchip text-3xl"></i>
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-300 uppercase tracking-wide">Ready for Ingest</h4>
                                    <p className="text-slate-500 text-sm mt-2">The AI coach is standing by to evaluate your performance metrics.</p>
                                </div>
                            )}

                            {status === AnalysisStatus.SUCCESS && result && (
                                <AnalysisDisplay result={result} />
                            )}

                            {(status === AnalysisStatus.EXTRACTING_FRAMES || status === AnalysisStatus.ANALYZING) && (
                                <div className="h-full glass-panel rounded-3xl border border-slate-800 p-8 space-y-6">
                                    <div className="animate-pulse flex flex-col gap-4">
                                        <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                                        <div className="h-10 bg-slate-800 rounded-lg w-3/4"></div>
                                        <div className="h-32 bg-slate-800 rounded-lg w-full"></div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="h-20 bg-slate-800 rounded-lg"></div>
                                            <div className="h-20 bg-slate-800 rounded-lg"></div>
                                        </div>
                                    </div>
                                    <div className="text-center py-4">
                                        <p className="text-cyan-500 text-xs font-black uppercase tracking-[0.2em] animate-pulse">Neural Core Processing Gameplay Data...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoAnalyzer;
