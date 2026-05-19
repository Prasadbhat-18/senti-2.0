/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import GlobeBackground from './components/visuals/Globe';
import Chatbot from './components/ui/Chatbot';
import { Shield, LayoutDashboard, User, BarChart2, LogOut } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem('sentinel_auth') === 'true'
  );

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('sentinel_auth', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('sentinel_auth');
  };
  return (
    <Router>
      <GlobeBackground />
      <nav className="fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass py-3 px-6 rounded-2xl border-white/5">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <Shield className="text-blue-500" />
            <span className="bg-linear-to-r from-white to-blue-400 bg-clip-text text-transparent">
              SENTINEL.AI
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <Link to="/#features" className="hover:text-blue-400 transition-colors">Features</Link>
            <Link to="/#security" className="hover:text-blue-400 transition-colors">Security</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
            )}
          </div>

          {isAuthenticated ? (
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-4 py-1.5 glass-accent rounded-lg border-red-500/30 text-sm hover:border-red-500 transition-all text-red-400"
            >
              <LogOut size={16} /> Disconnect
            </button>
          ) : (
            <Link to="/auth" className="flex items-center gap-2 px-4 py-1.5 glass-accent rounded-lg border-blue-500/30 text-sm hover:border-blue-500 transition-all">
              <User size={16} /> Sign In
            </Link>
          )}
        </div>
      </nav>

      <main className="pt-24 min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage isAuthenticated={isAuthenticated} />} />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />} 
          />
          <Route path="/auth" element={<Auth onLogin={login} isAuthenticated={isAuthenticated} />} />
        </Routes>
      </main>

      {isAuthenticated && <Chatbot />}

      <footer className="glass border-t-0 p-12 mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Shield className="text-blue-500" /> SENTINEL.AI
            </div>
            <p className="text-sm text-white/50">
              The futuristic command center for your digital identity and cybersecurity awareness.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white/90">Platform</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li>Privacy Scan</li>
              <li>Exposure Check</li>
              <li>AI Insights</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white/90">Company</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li>Open Labs</li>
              <li>Security Docs</li>
              <li>Ethics</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white/90">Newsletter</h4>
            <div className="flex gap-2">
              <input type="text" placeholder="Email" className="glass px-3 py-1.5 rounded-lg text-sm w-full outline-hidden" />
              <button className="bg-blue-600 px-4 py-1.5 rounded-lg text-sm font-bold">JOIN</button>
            </div>
          </div>
        </div>
        <div className="text-center mt-12 pt-8 border-t border-white/5 text-xs text-white/30 uppercase tracking-[.25em]">
          &copy; 2026 SENTINEL.AI / PROTOCOL-X-9
        </div>
      </footer>
    </Router>
  );
}
