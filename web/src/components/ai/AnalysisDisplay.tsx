import React from 'react';
import { AnalysisResult } from '@/types';

interface AnalysisDisplayProps {
    result: AnalysisResult;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result }) => {
    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-12">
            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Reaction Time', val: result.gameplayMetrics.reactionTimeScore, icon: 'fa-bolt-lightning', color: 'text-yellow-400' },
                    { label: 'Strategy', val: result.gameplayMetrics.strategicDepth, icon: 'fa-chess', color: 'text-cyan-400' },
                    { label: 'Execution', val: result.gameplayMetrics.executionAccuracy, icon: 'fa-crosshairs', color: 'text-rose-400' }
                ].map((stat, i) => (
                    <div key={i} className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4 relative overflow-hidden group">
                        <div className={`text-2xl ${stat.color} group-hover:scale-110 transition-transform`}>
                            <i className={`fa-solid ${stat.icon}`}></i>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{stat.label}</p>
                            <p className="text-lg font-black text-white">{stat.val}</p>
                        </div>
                        <div className={`absolute -right-2 -bottom-2 opacity-10 text-4xl ${stat.color}`}>
                            <i className={`fa-solid ${stat.icon}`}></i>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Report */}
            <div className="glass-panel rounded-3xl border border-slate-800 p-8 space-y-8">
                <section>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase rounded tracking-wider border border-cyan-500/20">Coach's Field Report</span>
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tight">{result.title}</h3>
                    <p className="text-slate-400 mt-4 leading-relaxed whitespace-pre-line text-lg">
                        {result.summary}
                    </p>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Tactical Analysis */}
                    <section className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <i className="fa-solid fa-map text-cyan-500"></i> Tactical Insights
                        </h4>
                        <div className="space-y-2">
                            {result.tacticalInsights.map((insight, i) => (
                                <div key={i} className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/50 flex gap-3">
                                    <span className="text-cyan-500 font-mono text-xs">0{i + 1}</span>
                                    <p className="text-slate-300 text-sm">{insight}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Pro Tips */}
                    <section className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <i className="fa-solid fa-star text-yellow-500"></i> Pro Suggestions
                        </h4>
                        <div className="space-y-2">
                            {result.proSuggestions.map((tip, i) => (
                                <div key={i} className="p-3 bg-yellow-500/5 rounded-xl border border-yellow-500/10 flex gap-3">
                                    <i className="fa-solid fa-circle-check text-yellow-500 mt-0.5 text-xs"></i>
                                    <p className="text-slate-200 text-sm font-medium">{tip}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Hardware & Settings Optimization */}
                <section className="pt-6 border-t border-slate-800">
                    <div className="bg-gradient-to-r from-cyan-500/10 to-transparent p-6 rounded-2xl border border-cyan-500/20">
                        <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <i className="fa-solid fa-microchip"></i> Performance Optimization
                        </h4>
                        <p className="text-slate-200 text-sm leading-relaxed">
                            {result.performanceOptimization}
                        </p>
                    </div>
                </section>

                {/* Timeline */}
                <section>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <i className="fa-solid fa-timeline text-cyan-500"></i> Play-by-Play Analysis
                    </h4>
                    <div className="space-y-4">
                        {result.keyMoments.map((moment, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="font-mono text-cyan-400 text-sm bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20 h-fit">
                                    {moment.timestamp}
                                </div>
                                <p className="text-slate-300 text-sm leading-snug group-hover:text-white transition-colors">
                                    {moment.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AnalysisDisplay;
