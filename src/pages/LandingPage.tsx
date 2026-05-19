import React from 'react';
import { motion } from 'motion/react';
import { GlassCard, NeonButton } from '../components/ui/CyberUI';
import { Shield, Zap, Search, Eye, Globe as GlobeIcon, Lock, ArrowRight, Activity, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage({ isAuthenticated }: { isAuthenticated: boolean }) {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-32">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8 py-20 relative">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8 }}
           className="relative"
        >
          <div className="absolute -inset-10 bg-blue-500/20 blur-[100px] rounded-full animate-pulse" />
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none relative z-10">
            OWN YOUR<br />
            <span className="bg-linear-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              DIGITAL SHADOW
            </span>
          </h1>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-xl text-white/60 font-medium"
        >
          The next-generation AI platform to analyze your digital footprint, 
          detect anomalies, and reclaim your online privacy exposure.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <NeonButton variant="blue" className="px-8 py-4 text-lg" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth')}>
            RUN PRIVACY SCAN <Search size={20} className="inline ml-2" />
          </NeonButton>
          <NeonButton variant="purple" className="px-8 py-4 text-lg" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth')}>
             OPEN COMMAND CENTER <Terminal size={20} className="inline ml-2" />
          </NeonButton>
        </motion.div>
        
        {/* Real-time Ticker */}
        <div className="absolute bottom-0 w-full glass-accent py-2 border-y border-white/5 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap flex gap-12 text-xs font-mono uppercase text-blue-400/80">
            <span>[ ALERT ] 4.2B RECORDS LEAKED IN LAST 24H</span>
            <span>[ BREACH ] NEW DATALAKE EXPOSURE DETECTED (PLATFORM-X)</span>
            <span>[ SYSTEM ] AI MODELS OPTIMIZED FOR THREAT DETECTION</span>
            <span>[ ALERT ] IP-TRACKING ACTIVITY UP 12% IN EU</span>
            <span>[ STATUS ] ALL SYSTEMS NOMINAL - ENCRYPTION VERIFIED</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold tracking-tight">PLATFORM CAPABILITIES</h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="space-y-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
              <Eye size={24} />
            </div>
            <h3 className="text-xl font-bold">Deep Exposure Scan</h3>
            <p className="text-white/50 text-sm">
              Our AI engine crawls public data, breach lists, and search results to map your exact digital surface.
            </p>
          </GlassCard>

          <GlassCard className="space-y-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-bold">Behavioral Analytics</h3>
            <p className="text-white/50 text-sm">
              Understand how algorithms profile you based on your browsing patterns and social interactions.
            </p>
          </GlassCard>

          <GlassCard className="space-y-4">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold">Risk Management</h3>
            <p className="text-white/50 text-sm">
              Get actionable alerts for password leaks, suspicious logins, and privacy misconfigurations.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1 space-y-6">
          <h2 className="text-5xl font-black leading-tight">THE NUMBERS<br /><span className="text-blue-500">DONT LIE.</span></h2>
          <p className="text-white/60">
            Privacy is no longer a luxury; it's a defensive requirement in the age of pervasive tracking.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-3xl font-mono font-bold">94%</div>
              <div className="text-xs uppercase text-white/40">User Profiling Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-mono font-bold">12k+</div>
              <div className="text-xs uppercase text-white/40">Breach Sources Tracked</div>
            </div>
          </div>
        </div>
        <div className="flex-1 w-full">
          <GlassCard className="bg-blue-500/5 border-blue-500/20 p-8">
             <div className="space-y-4 font-mono text-xs text-blue-300">
                <div className="flex justify-between"><span>[ SCAN_TYPE ]</span> <span>METADATA_EXTRACT</span></div>
                <div className="flex justify-between"><span>[ OBJECTIVE ]</span> <span>ANONYMITY_LEAK_TEST</span></div>
                <div className="h-40 bg-black/40 rounded flex flex-col p-2 overflow-hidden">
                   <div className="animate-pulse">CONNECTING TO NODE-742...</div>
                   <div>DECRYPTING HEADERS...</div>
                   <div className="text-green-500">SRC_IP FOUND: 192.168.**.**</div>
                   <div className="text-red-500">EXPOSURE DETECTED: SOCIAL_MEDIA_METADATA</div>
                   <div>EXTRACTING LAT/LONG...</div>
                   <div className="text-cyan-400">AI PREDICTION: USER_PERSONALITY_TYPE_INTJ</div>
                </div>
                <div className="pt-4 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                   LIVE_SCANNING_ACTIVE
                </div>
             </div>
          </GlassCard>
        </div>
      </section>

      {/* CTA section */}
      <section className="text-center py-20">
         <GlassCard className="py-20 px-12 space-y-8 bg-linear-to-br from-blue-500/10 to-purple-500/10">
            <h2 className="text-5xl font-bold">Ready to secure your future?</h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Join thousands of users who have reclaimed their digital autonomy using our advanced AI detection models.
            </p>
            <div className="flex justify-center gap-4">
               <NeonButton variant="blue" className="px-10 py-3" onClick={() => navigate('/auth')}>GET STARTED NOW</NeonButton>
            </div>
         </GlassCard>
      </section>
    </div>
  );
}
