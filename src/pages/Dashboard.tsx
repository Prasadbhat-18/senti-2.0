import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard, NeonButton, cn } from '../components/ui/CyberUI';
import { 
  ShieldCheck, AlertTriangle, Fingerprint, Activity, Globe, 
  MapPin, Send, MessageSquare, Filter, ChevronDown, 
  BarChart3, PieChart as PieChartIcon, Target, TrendingUp, AlertCircle,
  Link as LinkIcon, Loader2, Lock, CheckCircle, Search, ShieldAlert
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, Cell
} from 'recharts';

// --- Mock Data ---
const riskData = [
  { time: '00:00', risk: 40 },
  { time: '04:00', risk: 35 },
  { time: '08:00', risk: 65 },
  { time: '12:00', risk: 45 },
  { time: '16:00', risk: 80 },
  { time: '20:00', risk: 50 },
  { time: '23:59', risk: 42 },
];

const radarData = [
  { subject: 'Privacy', A: 120, fullMark: 150 },
  { subject: 'Security', A: 98, fullMark: 150 },
  { subject: 'Browsing', A: 86, fullMark: 150 },
  { subject: 'Social', A: 99, fullMark: 150 },
  { subject: 'Email', A: 85, fullMark: 150 },
];

const platforms = ['Instagram', 'YouTube', 'Discord', 'Reddit', 'X/Twitter', 'GitHub', 'Google', 'Spotify'];
const dataSources = ['Browser History', 'Social Media', 'Location Data', 'Email Metadata', 'Cloud Activity'];

const getSafeHostname = (urlStr: string) => {
  try {
    const url = (urlStr && urlStr.startsWith('http')) ? urlStr : `https://${urlStr || 'link'}`;
    return new URL(url).hostname;
  } catch {
    return urlStr || 'unknown-host';
  }
};

function IdentityScanner({ onScanComplete }: { onScanComplete: (data?: any) => void }) {
  const [identifier, setIdentifier] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;
    setIsScanning(true);
    setResult(null);
    try {
      const resp = await fetch('/api/analyse-identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });
      const data = await resp.json();
      setResult(data);
      onScanComplete({ type: 'identity', data });
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleScan} className="relative">
        <input 
          type="text" 
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="ENTER EMAIL OR PHONE (E.G. +1...)" 
          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00f2ff]/50 transition-all font-mono"
        />
        <div className="absolute right-2 top-2">
          <NeonButton variant="blue" className="py-2" disabled={isScanning}>
            {isScanning ? <ShieldAlert className="w-4 h-4 animate-pulse" /> : <Search className="w-4 h-4" />}
          </NeonButton>
        </div>
      </form>

      <AnimatePresence mode="wait">
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="p-4 glass border-purple-500/20 rounded-xl flex flex-col items-center justify-center gap-3 py-8 mt-6"
          >
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            <div className="text-xs font-mono animate-pulse uppercase tracking-widest text-white/50">Cross-referencing Deep Web...</div>
          </motion.div>
        )}

        {result && !isScanning && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 glass rounded-2xl space-y-5",
            result.isExposed ? "border-red-500/50 bg-red-500/5 shadow-[0_0_30px_rgba(239,68,68,0.1)]" : "border-green-500/30 bg-green-500/5"
          )}
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">THREAT REPORT: {identifier}</span>
            <div className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[3px] shadow-sm",
              result.isExposed ? "bg-red-500 text-white" : "bg-green-500/20 text-green-400"
            )}>
              {result.isExposed ? 'EXPOSED' : 'SECURE'}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
               <div className="text-[10px] text-white/40 uppercase font-black mb-1">Exposure Score</div>
               <div className={cn("text-2xl font-black font-mono", (result?.riskScore || 0) > 70 ? "text-red-500" : "text-blue-400")}>
                 {result?.riskScore || 0}%
               </div>
             </div>
             <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
               <div className="text-[10px] text-white/40 uppercase font-black mb-1">Known Breaches</div>
               <div className={cn("text-2xl font-black font-mono", result?.breaches?.length > 0 ? "text-red-500" : "text-white")}>
                 {result?.breaches?.length || 0}
               </div>
             </div>
          </div>

          {(result?.breaches?.length || 0) > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] text-white/40 uppercase">KNOWN BREACHES</div>
              {result.breaches.map((b: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-white/5 rounded-lg border border-white/5">
                  <div>
                    <div className="text-xs font-bold text-white/90">{b.site}</div>
                    <div className="text-[10px] text-white/40">{(b.dataClasses || []).join(', ')}</div>
                  </div>
                  <div className="text-[10px] font-mono text-white/40">{b.date}</div>
                </div>
              ))}
            </div>
          )}

          {result?.appsCausingLeak && result.appsCausingLeak.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] text-white/40 uppercase">LEAK SOURCES / RISKY APPS</div>
              <div className="flex flex-wrap gap-2">
                {result.appsCausingLeak.map((app: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-[10px] text-blue-400 font-mono">
                    {app}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LinkScanner({ onScanComplete, history }: { onScanComplete: (data?: any) => void, history: any[] }) {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setIsScanning(true);
    setResult(null);
    
    try {
      const resp = await fetch('/api/analyze-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await resp.json();
      setResult(data);
      onScanComplete({ type: 'link', data, url }); // Refresh history
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleScan} className="flex gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste protocol link (https://...)"
            className="w-full glass bg-white/5 py-2 pl-10 pr-4 rounded-xl text-sm focus:border-[#00f2ff]/50 outline-none"
          />
        </div>
        <NeonButton 
          variant="blue" 
          className="px-4 py-2 text-xs h-auto rounded-xl"
          onClick={() => {}}
        >
          SCAN
        </NeonButton>
      </form>

      <AnimatePresence mode="wait">
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="p-4 glass border-[#00f2ff]/20 rounded-xl flex flex-col items-center justify-center gap-3 py-8"
          >
            <Loader2 className="w-8 h-8 animate-spin text-[#00f2ff]" />
            <div className="text-xs font-mono animate-pulse uppercase tracking-widest">Running Deep Packet Inspection...</div>
          </motion.div>
        )}

        {result && !isScanning && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "p-6 glass rounded-2xl space-y-4 shadow-2xl relative overflow-hidden",
              result.riskLevel === 'Critical' || result.riskLevel === 'High' 
                ? 'border-red-500/50 bg-red-500/5' 
                : 'border-green-500/40 bg-green-500/5'
            )}
          >
            {(result.riskLevel === 'Critical' || result.riskLevel === 'High') && (
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
            )}
            
            <div className="flex justify-between items-center relative z-10">
              <h4 className="text-sm font-black flex items-center gap-2 uppercase tracking-tighter">
                {result.riskLevel === 'Critical' || result.riskLevel === 'High' 
                  ? <AlertTriangle className="text-red-500 animate-bounce" size={20} />
                  : <CheckCircle className="text-green-400" size={20} />
                }
                DETECTION ANALYSIS
              </h4>
              <span className={cn(
                "text-xs px-3 py-1 rounded-full uppercase font-black tracking-widest",
                result.riskLevel === 'High' || result.riskLevel === 'Critical' ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-green-500/20 text-green-400'
              )}>
                {result.riskLevel} RISK
              </span>
            </div>
            
            <div className="space-y-2 relative z-10">
              <p className={cn(
                "text-sm font-bold leading-tight",
                result.riskLevel === 'High' || result.riskLevel === 'Critical' ? 'text-red-200' : 'text-green-100'
              )}>
                {result?.summary || 'Scanning complete.'}
              </p>
              
              <div className="flex flex-wrap gap-2 pt-2">
                {(result?.threats || []).map((t: string) => (
                  <span key={t} className="text-[10px] bg-black/40 px-2 py-1 rounded border border-white/10 text-white font-mono uppercase">
                    • {t}
                  </span>
                ))}
              </div>

              {result.recommendation && (
                <div className="mt-4 p-3 bg-black/30 rounded-xl border border-white/5">
                  <p className="text-[10px] text-white/40 uppercase font-black mb-1">Recommendation</p>
                  <p className="text-xs text-white/80">{result.recommendation}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History List */}
      {history.length > 0 && (
        <div className="space-y-3 border-t border-white/5 pt-4">
          <h4 className="text-[10px] uppercase font-bold text-white/30 tracking-widest px-1">Scan History (Database Vault)</h4>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-hide">
            {history.map((item, idx) => (
              <div key={item._id || idx} className="p-3 glass border-white/5 rounded-lg flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-white/30 truncate">{item.url}</p>
                  <p className="text-xs font-semibold truncate text-white/80">{item.summary}</p>
                </div>
                <div className={cn(
                  "text-[9px] px-2 py-0.5 rounded flex-shrink-0 uppercase font-black",
                  item.riskLevel === 'High' || item.riskLevel === 'Critical' ? 'text-red-500 bg-red-500/10' : 'text-green-400 bg-green-400/10'
                )}>
                  {item.riskLevel}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [selectedPlatform, setSelectedPlatform] = useState('All Platforms');
  const [selectedSource, setSelectedSource] = useState('Global Stream');
  const [history, setHistory] = useState<any[]>([]);
  const [hasScanned, setHasScanned] = useState(false);

  const generateMockStats = (scanType: string, data: any) => {
    const isHighRisk = scanType === 'link' ? (data.riskLevel === 'High' || data.riskLevel === 'Critical') : data.riskScore > 50;
    const privacyScore = isHighRisk ? 42 : 92;
    return {
      privacyScore,
      exposureLevel: isHighRisk ? "High" : "Low",
      threatProbability: isHighRisk ? 85 : 5,
      trackingCount: Math.floor(Math.random() * 100) + 20,
      activeThreats: isHighRisk ? 1 : 0,
      vulnerabilities: isHighRisk ? 2 : 0,
      threatTrend: [
        { name: 'T-3', value: 20 },
        { name: 'T-2', value: 25 },
        { name: 'T-1', value: 30 },
        { name: 'Now', value: isHighRisk ? 90 : 10 }
      ],
      riskDistribution: [
        { name: 'Critical', value: scanType === 'link' && data.riskLevel === 'Critical' ? 1 : 0 },
        { name: 'High', value: (scanType === 'link' && data.riskLevel === 'High') || (scanType === 'identity' && data.riskScore > 70) ? 1 : 0 },
        { name: 'Medium', value: (scanType === 'link' && data.riskLevel === 'Medium') || (scanType === 'identity' && data.riskScore > 30 && data.riskScore <= 70)  ? 1 : 0 },
        { name: 'Low', value: scanType === 'link' && data.riskLevel === 'Low' ? 1 : 0 }
      ]
    };
  };

  const refreshDashboard = async (latestScan?: any) => {
    try {
      if (latestScan) {
        setHasScanned(true);
        // Initially apply local mock stats immediately for responsiveness
        const newStats = generateMockStats(latestScan.type, latestScan.data);
        setStats(newStats);
        
        // Optimistic history update
        if (latestScan.type === 'link') {
            setHistory(prev => [{ url: latestScan.url, riskLevel: latestScan.data.riskLevel, summary: latestScan.data.summary, timestamp: new Date() }, ...prev].slice(0, 5));
        } else {
            setHistory(prev => [{ url: 'Identity Scan', riskLevel: latestScan.data.riskScore > 50 ? 'High' : 'Low', summary: `Exposed in ${latestScan.data.breaches?.length || 0} breaches.`, timestamp: new Date() }, ...prev].slice(0, 5));
        }
      }

      // Fetch real stats to overwrite
      const statsResp = await fetch('/api/stats');
      if (statsResp.ok) {
        const statsData = await statsResp.json();
        // If DB is real, there will be positive totalScans via activeThreats / privacy score if connected
        if (statsData.privacyScore !== 0) {
            setStats(statsData);
        }
      }
      // Refresh History if DB real
      const historyResp = await fetch('/api/link-history');
      if (historyResp.ok) {
        const historyData = await historyResp.json();
        if (historyData.length > 0) {
            setHistory(historyData);
        }
      }
    } catch (e) {
      console.error("Failed to refresh dashboard:", e);
    }
  };
  
  const hasData = hasScanned;

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase flex items-center gap-3">
            <Fingerprint className="text-blue-500" /> Command Center
          </h1>
          <p className="text-white/40 text-sm font-mono mt-2">ID: PROTOCOL-775 \ STATUS: {hasData ? 'ACTIVE' : 'IDLE'} \ NODE: TOKYO-S3</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Dropdown label={selectedSource} options={dataSources} onSelect={setSelectedSource} icon={<Filter size={16} />} />
          <Dropdown label={selectedPlatform} options={platforms} onSelect={setSelectedPlatform} icon={<Activity size={16} />} />
        </div>
      </div>

      {/* Scanners Section - High Prominence if no data */}
      <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6", !hasData && "scale-105 transition-transform duration-500")}>
        <GlassCard className={cn(!hasData && "border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]")}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold flex items-center gap-2 text-[#00f2ff]">
              <Lock className="w-5 h-5" /> LINK THREAT SCANNER
            </h3>
            {!hasData && <span className="text-[10px] bg-blue-500 px-2 py-0.5 rounded text-white animate-pulse">START HERE</span>}
          </div>
          <LinkScanner onScanComplete={refreshDashboard} history={history} />
        </GlassCard>

        <GlassCard className={cn(!hasData && "border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]")}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold flex items-center gap-2 text-purple-400">
              <ShieldAlert className="w-5 h-5" /> IDENTITY DEEP SCANNER
            </h3>
            {!hasData && <span className="text-[10px] bg-purple-500 px-2 py-0.5 rounded text-white animate-pulse">PROTECT IDENTITY</span>}
          </div>
          <IdentityScanner onScanComplete={refreshDashboard} />
        </GlassCard>
      </div>

      {!hasData ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20 text-center space-y-4 glass border-dashed bg-white/5"
        >
          <div className="flex justify-center">
            <ShieldCheck className="w-16 h-16 text-white/10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white/60">NO THREAT DATA DETECTED</h3>
            <p className="text-white/30 text-sm font-mono max-w-md mx-auto mt-2 italic">
              "Sentinel is ready. Input a URL or identity marker above to begin real-time heuristic analysis."
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              label="Privacy Risk Score" 
              value={stats?.privacyScore || 0} 
              unit="%" 
              trend={stats?.privacyScore > 70 ? "+2.1%" : "-1.4%"} 
              variant="risk" 
              icon={<ShieldCheck size={20} />} 
            />
            <StatCard 
              label="Tracking Activity" 
              value={stats?.trackingCount || 0} 
              unit="pts" 
              trend={stats?.trackingCount > 100 ? "+12%" : "Safe"} 
              variant="blue" 
              icon={<Target size={20} />} 
            />
            <StatCard 
              label="Cyber Threat Level" 
              value={stats?.threatProbability || 0} 
              unit="%" 
              trend="Dynamic" 
              variant="purple" 
              icon={<AlertTriangle size={20} />} 
            />
            <StatCard 
              label="Network Exposure" 
              value={stats?.exposureLevel || "None"} 
              unit="" 
              trend="Live" 
              variant="warning" 
              icon={<Globe size={20} />} 
            />
          </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold tracking-tight flex items-center gap-2">
               <TrendingUp className="text-blue-500" /> RISK TREND ANALYSIS
            </h3>
            <span className="text-[10px] font-mono glass px-2 py-1 rounded">24H TIMELINE</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.threatTrend || riskData}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col">
          <h3 className="font-bold mb-6 tracking-tight flex items-center gap-2">
            <AlertCircle className="text-purple-500" /> RISK DISTRIBUTION
          </h3>
          <div className="h-[250px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.riskDistribution || [
                { name: 'Low', value: 40 },
                { name: 'Med', value: 30 },
                { name: 'High', value: 20 },
                { name: 'Crit', value: 10 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#ffffff05'}}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  { (stats?.riskDistribution || [
                { name: 'Low', value: 40 },
                { name: 'Med', value: 30 },
                { name: 'High', value: 20 },
                { name: 'Crit', value: 10 },
              ]).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={
                      entry.name === 'Critical' ? '#ef4444' : 
                      entry.name === 'High' ? '#f59e0b' : 
                      entry.name === 'Medium' ? '#3b82f6' : '#10b981'
                    } />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
             <div className="flex justify-between text-xs">
                <span className="text-white/50">Overall Security</span>
                <span className={cn(
                  "font-bold",
                  stats?.exposureLevel === 'Low' ? 'text-green-400' : stats?.exposureLevel === 'Medium' ? 'text-amber-400' : 'text-red-500'
                )}>{(stats?.exposureLevel || 'EXCELLENT').toUpperCase()}</span>
             </div>
             <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-1000",
                    stats?.exposureLevel === 'Low' ? 'bg-green-500' : stats?.exposureLevel === 'Medium' ? 'bg-amber-500' : 'bg-red-500'
                  )} 
                  style={{ width: `${stats?.privacyScore || 85}%` }} 
                />
             </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
           <h3 className="font-bold mb-6 flex items-center gap-2">
             <Activity className="text-green-500" /> RECENT ACTIVITY STREAM
           </h3>
             <div className="space-y-4">
                {history.length > 0 ? history.slice(0, 5).map((item, idx) => (
                  <ActivityItem 
                    key={`scan-activity-${idx}`}
                    time={new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                    title="Link Analysis Completed" 
                    desc={`Hostname: ${getSafeHostname(item.url)}. Identified risk level: ${item.riskLevel}. "${item.summary}"`} 
                    type={
                      item.riskLevel === 'Critical' || item.riskLevel === 'High' ? 'danger' : 
                      item.riskLevel === 'Medium' ? 'warning' : 'success'
                    } 
                  />
                )) : (
                  <div className="text-xs text-white/20 font-mono py-10 text-center">
                    NO ACTIVE THREADS IN STREAM
                  </div>
                )}
             </div>
          </GlassCard>

        <GlassCard className="bg-linear-to-br from-blue-500/5 to-purple-500/5 self-start">
           <h3 className="font-bold mb-6 flex items-center gap-2">
             <MessageSquare className="text-blue-400" /> SENTINEL BOT INSIGHTS
           </h3>
           <div className="space-y-6">
              <p className="text-sm text-white/70 italic leading-relaxed">
                {!stats 
                  ? '"Initializing Sentinel Neural Link... Scanning local node for privacy metrics."'
                  : stats.privacyScore < 60 
                  ? `"Alert: Your privacy score of ${stats?.privacyScore}% is sub-optimal. The ${stats?.activeThreats} active threats identified pose a significant risk to your digital identity. Recommended action: Enable Advanced DNS shielding immediately."`
                  : stats.privacyScore < 85
                  ? `"Dashboard Status: Your exposure level is ${stats?.exposureLevel}. We've tracked ${stats?.trackingCount} potential profiling attempts. Most originate from link metadata trackers."`
                  : `"System Optimal: Your privacy shield is holding at ${stats?.privacyScore ?? '--'}%. No critical vulnerabilities detected in the current node cycle."`}
              </p>
              <div className="grid grid-cols-2 gap-4">
                 <div className="glass p-3 rounded-xl border-white/5">
                    <div className="text-[10px] text-white/40 uppercase">Exposure</div>
                    <div className={cn(
                      "text-lg font-bold",
                      stats?.exposureLevel === 'High' ? 'text-red-500' : 'text-blue-400'
                    )}>{stats?.exposureLevel || "Low"}</div>
                 </div>
                 <div className="glass p-3 rounded-xl border-white/5">
                    <div className="text-[10px] text-white/40 uppercase">Vulnerability</div>
                    <div className={cn(
                      "text-lg font-bold",
                      stats?.vulnerabilities > 0 ? 'text-red-500' : 'text-green-500'
                    )}>{stats?.vulnerabilities > 0 ? stats.vulnerabilities : 'NONE'}</div>
                 </div>
              </div>
              <NeonButton variant="blue" className="w-full" onClick={() => {
                alert("Please use the AETHER AI CORE button on the bottom right.")
              }}>
                CONSULT PRIVACY ASSISTANT
              </NeonButton>
           </div>
        </GlassCard>
      </div>
      </motion.div>
      )}
    </div>
  );
}

function StatCard({ label, value, unit, trend, variant, icon }: any) {
  const colors = {
    risk: 'text-red-500',
    blue: 'text-blue-500',
    purple: 'text-purple-500',
    warning: 'text-amber-500'
  };

  return (
    <GlassCard className="relative group hover:border-white/20 transition-all">
      <div className={cn("absolute top-4 right-4 opacity-20 group-hover:opacity-60 transition-opacity", colors[variant as keyof typeof colors])}>
        {icon}
      </div>
      <div className="space-y-2">
        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">{label}</p>
        <div className="flex items-baseline gap-1">
          <h4 className={cn("text-3xl font-black font-mono", colors[variant as keyof typeof colors])}>{value}</h4>
          <span className="text-white/40 text-xs font-bold">{unit}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={cn("px-2 py-0.5 rounded-full glass border-white/5", 
            trend.includes('+') ? 'text-red-500' : trend === 'Static' ? 'text-white/40' : 'text-green-500'
          )}>
            {trend}
          </span>
          <span className="text-white/20">vs prev session</span>
        </div>
      </div>
    </GlassCard>
  );
}

function Dropdown({ label, options, onSelect, icon }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm font-medium hover:border-white/20 transition-all"
      >
        {icon} {label} <ChevronDown size={14} className={cn("transition-transform", isOpen && "rotate-180")} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 left-0 w-48 glass rounded-xl overflow-hidden z-20 border-white/10"
          >
            {options.map((opt: string) => (
              <button 
                key={opt}
                onClick={() => { onSelect(opt); setIsOpen(false); }}
                className="w-full text-left px-4 py-2 text-xs hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActivityItem({ time, title, desc, type }: any) {
  const colors = {
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
    success: 'bg-green-500',
    danger: 'bg-red-500'
  };

  return (
    <div className="flex gap-4 group">
       <div className="flex flex-col items-center">
          <div className={cn("w-2 h-2 rounded-full mt-2", colors[type as keyof typeof colors])} />
          <div className="w-[1px] flex-1 bg-white/5 my-1" />
       </div>
       <div className="pb-4">
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-mono text-white/30">{time}</span>
             <h5 className="text-sm font-bold tracking-tight">{title}</h5>
          </div>
          <p className="text-xs text-white/50 mt-1 leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}
