import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard, NeonButton, cn } from '../components/ui/CyberUI';
import { 
  ShieldCheck, AlertTriangle, Fingerprint, Activity, Globe, 
  MapPin, Send, MessageSquare, Filter, ChevronDown, 
  BarChart3, PieChart as PieChartIcon, Target, TrendingUp, AlertCircle,
  Link as LinkIcon, Loader2, Lock, CheckCircle
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

function LinkScanner() {
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
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-4">
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
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="p-4 glass border-white/5 rounded-xl space-y-3"
          >
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <CheckCircle className="text-green-400" size={16} /> Analysis Complete
              </h4>
              <span className={cn(
                "text-[10px] px-2 py-0.5 rounded-full uppercase font-bold",
                result.riskLevel === 'High' || result.riskLevel === 'Critical' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'
              )}>
                {result.riskLevel} RISK
              </span>
            </div>
            <p className="text-xs text-white/70 italic">"{result.summary}"</p>
            <div className="flex flex-wrap gap-2">
              {result.threats.map((t: string) => (
                <span key={t} className="text-[9px] bg-white/5 px-2 py-0.5 rounded-md border border-white/10 uppercase">{t}</span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('All Platforms');
  const [selectedSource, setSelectedSource] = useState('Global Stream');
  
  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(setStats);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase flex items-center gap-3">
            <Fingerprint className="text-blue-500" /> Command Center
          </h1>
          <p className="text-white/40 text-sm font-mono mt-2">ID: PROTOCOL-775 \ STATUS: ENCRYPTED \ NODE: TOKYO-S3</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Dropdown label={selectedSource} options={dataSources} onSelect={setSelectedSource} icon={<Filter size={16} />} />
          <Dropdown label={selectedPlatform} options={platforms} onSelect={setSelectedPlatform} icon={<Activity size={16} />} />
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Privacy Risk Score" 
          value={stats?.privacyScore || 0} 
          unit="%" 
          trend="+2.1%" 
          variant="risk" 
          icon={<ShieldCheck size={20} />} 
        />
        <StatCard 
          label="Tracking Activity" 
          value={stats?.trackingCount || 0} 
          unit="pts" 
          trend="-12%" 
          variant="blue" 
          icon={<Target size={20} />} 
        />
        <StatCard 
          label="Cyber Threat Level" 
          value={stats?.threatProbability || 0} 
          unit="%" 
          trend="Static" 
          variant="purple" 
          icon={<AlertTriangle size={20} />} 
        />
        <StatCard 
          label="Network Exposure" 
          value="High" 
          unit="" 
          trend="Increasing" 
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
              <AreaChart data={riskData}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="time" stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="risk" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col">
          <h3 className="font-bold mb-6 tracking-tight flex items-center gap-2">
            <AlertCircle className="text-purple-500" /> PRIVACY RADAR
          </h3>
          <div className="h-[250px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#ffffff20" />
                <PolarAngleAxis dataKey="subject" stroke="#ffffff60" fontSize={10} />
                <Radar name="User" dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
             <div className="flex justify-between text-xs">
                <span className="text-white/50">Overall Security</span>
                <span className="text-purple-400">EXCELLENT</span>
             </div>
             <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full w-[85%]" />
             </div>
          </div>
        </GlassCard>
      </div>

      {/* Activity Monitor & AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <GlassCard>
            <h3 className="font-bold mb-6 flex items-center gap-2 text-[#00f2ff]">
              <Lock className="w-5 h-5" /> REAL-TIME THREAT SCANNER
            </h3>
            <LinkScanner />
          </GlassCard>
          
          <GlassCard>
             <h3 className="font-bold mb-6 flex items-center gap-2">
               <Activity className="text-green-500" /> RECENT ACTIVITY STREAM
             </h3>
             <div className="space-y-4">
                <ActivityItem 
                  time="14:22" 
                  title="Unknown Device Login" 
                  desc="A login attempt from Jakarta, ID was identified." 
                  type="warning" 
                />
                <ActivityItem 
                  time="11:05" 
                  title="Data Share Detected" 
                  desc="TikTok synced 24 contacts with external servers." 
                  type="info" 
                />
                <ActivityItem 
                  time="09:12" 
                  title="Browser Leak Blocked" 
                  desc="Prevented fingerprinting attempt from ad-tracker.net" 
                  type="success" 
                />
                <ActivityItem 
                  time="Yesterday" 
                  title="Breach Notification" 
                  desc="Email found in 2024 Canva data dump." 
                  type="danger" 
                />
             </div>
          </GlassCard>
        </div>

        <GlassCard className="bg-linear-to-br from-blue-500/5 to-purple-500/5 self-start">
           <h3 className="font-bold mb-6 flex items-center gap-2">
             <MessageSquare className="text-blue-400" /> SENTINEL BOT INSIGHTS
           </h3>
           <div className="space-y-6">
              <p className="text-sm text-white/70 italic leading-relaxed">
                "Based on your recent email metadata and location patterns, your profile is currently tagged as a 'High-Value Professional'. 34% of your daily tracking comes from financial services profiling. Recommended action: Enable Advanced DNS shielding."
              </p>
              <div className="grid grid-cols-2 gap-4">
                 <div className="glass p-3 rounded-xl border-white/5">
                    <div className="text-[10px] text-white/40 uppercase">Ad Targeting</div>
                    <div className="text-lg font-bold text-blue-400">72% Focus</div>
                 </div>
                 <div className="glass p-3 rounded-xl border-white/5">
                    <div className="text-[10px] text-white/40 uppercase">Vulnerability</div>
                    <div className="text-lg font-bold text-red-500">Low</div>
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
