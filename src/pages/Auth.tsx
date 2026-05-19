import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GlassCard, NeonButton } from '../components/ui/CyberUI';
import { 
  Shield, Mail, Lock, User, Github, Chrome, ArrowRight, 
  Fingerprint, Activity 
} from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';

interface AuthProps {
  onLogin: () => void;
  isAuthenticated: boolean;
}

export default function Auth({ onLogin, isAuthenticated }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleAuth = () => {
    // Simulate successful authentication
    onLogin();
    navigate('/dashboard');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 glass rounded-2xl mb-4">
          <Shield className="text-blue-500" size={32} />
        </div>
        <h1 className="text-3xl font-black">{isLogin ? 'ACCESS GRANTED' : 'CREATE PROTOCOL'}</h1>
        <p className="text-white/40 text-sm">Secure your digital footprint with biometric-level auth.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto items-center">
        <div className="hidden md:block space-y-8">
          <h2 className="text-2xl font-bold text-blue-400 uppercase tracking-widest">Protocol Features</h2>
          <div className="space-y-6">
            <FeatureItem title="Neural Risk Analysis" desc="Real-time AI monitoring of your digital identity." icon={<Shield size={18} />} />
            <FeatureItem title="Identity Fingerprinting" desc="See how advertisers and trackers see you." icon={<Fingerprint size={18} />} />
            <FeatureItem title="Breach Lockdown" desc="Immediate alerts for data leaks and hacks." icon={<Activity size={18} />} />
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <GlassCard className="space-y-6 bg-[#0a0a0a]/80">
            <div className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white/30 ml-2">Full Identity</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      className="w-full glass bg-white/5 py-3 pl-12 pr-4 rounded-xl outline-hidden focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-white/30 ml-2">Contact Endpoint</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input 
                    type="email" 
                    placeholder="agent@footprint.ai" 
                    className="w-full glass bg-white/5 py-3 pl-12 pr-4 rounded-xl outline-hidden focus:border-blue-500/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-2">
                  <label className="text-[10px] uppercase font-bold text-white/30">Security Key</label>
                  {isLogin && <button className="text-[10px] uppercase text-blue-400 hover:underline">Forgot?</button>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full glass bg-white/5 py-3 pl-12 pr-4 rounded-xl outline-hidden focus:border-blue-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <NeonButton 
              variant="blue" 
              className="w-full py-4 font-bold" 
              onClick={handleAuth}
            >
              {isLogin ? 'INITIALIZE SESSION' : 'REGISTER PROTOCOL'} <ArrowRight size={18} className="inline ml-2" />
            </NeonButton>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="glass px-4 py-1 rounded-full text-white/30">Or integrate via</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="glass py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
                <Github size={18} /> <span className="text-xs font-bold">GITHUB</span>
              </button>
              <button className="glass py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
                <Chrome size={18} /> <span className="text-xs font-bold">GOOGLE</span>
              </button>
            </div>
          </GlassCard>

          <div className="text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-white/40 hover:text-blue-400 transition-colors"
            >
              {isLogin ? "Don't have a protocol yet? Register here." : "Already have a protocol? Login here."}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="p-2 glass rounded-lg text-blue-400">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold">{title}</h4>
        <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
