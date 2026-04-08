import React, { useState, useEffect } from "react";
import { db } from "./service/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import InputAset from "./components/InputAset";
import Chart from "./components/Chart";
import { Save, RefreshCcw, Orbit, Sparkles, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem("portosphere_cache");
    return saved ? JSON.parse(saved) : [{ name: "", value: "" }];
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "portfolio", "user1"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data && data.assets) {
          const freshAssets = data.assets.length > 0 ? data.assets : [{ name: "", value: "" }];
          setAssets(freshAssets);
          localStorage.setItem("portosphere_cache", JSON.stringify(freshAssets));
          setIsSynced(true);
        }
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const saveData = async () => {
    setSaving(true);
    try {
      const filteredAssets = assets.filter(item => item.name || item.value).map((item) => ({
        name: item.name,
        value: Number(item.value) || 0,
       }));
      
      await setDoc(doc(db, "portfolio", "user1"), {
        assets: filteredAssets,
        updatedAt: new Date().toISOString(),
        total: filteredAssets.reduce((s, a) => s + a.value, 0)
      });
      
      localStorage.setItem("portosphere_cache", JSON.stringify(filteredAssets));
      setIsSynced(true);
    } catch (err) {
      console.error("Error saving data:", err);
    } finally {
      setTimeout(() => setSaving(false), 1000);
    }
  };

  return (
    <div className="container">
      {/* Background Sphere Effects */}
      <div className="bg-glow-1" />
      <div className="bg-glow-2" />

      <header className="header">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="logo-container"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="orbit-icon"
          >
             <BrandOrbit size={48} color="var(--primary)" strokeWidth={2} />
             <div className="icon-glow" />
          </motion.div>
          <h1 className="title">PortoSphere</h1>
        </motion.div>
        
        <div className="sync-status">
          <AnimatePresence mode="wait">
            {!loading ? (
              <motion.div 
                key="ready"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="status-pill ready"
              >
                <div className="status-dot green" />
                <span>Orbiting Live Data</span>
              </motion.div>
            ) : (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="status-pill loading"
              >
                STABILIZING CONNECTION...
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="main-layout">
        <div className="column left">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <InputAset assets={assets} setAssets={setAssets} />
          </motion.div>
          
          <motion.div
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <button 
              onClick={saveData} 
              disabled={saving}
              className={`save-button ${saving ? 'saving' : ''}`}
            >
              {saving ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <RefreshCcw size={22} />
                  </motion.div>
                  Syncing Changes...
                </>
              ) : (
                <>
                  <ShieldCheck size={22} />
                  Secure Assets to Cloud
                </>
              )}
            </button>
          </motion.div>

          <section className="card glass-small">
             <div className="integrity-check">
               <span>Cloud Integrity Check</span>
               <Sparkles size={16} color="var(--primary)" />
             </div>
          </section>
        </div>

        <motion.section
          layout
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="column right"
        >
          <Chart assets={assets} isPortoSphere={true} />
        </motion.section>
      </main>
      
      <style>{`
        .bg-glow-1 {
          position: fixed; top: -10%; right: -10%; width: 400px; height: 400px; z-index: -1; border-radius: 50%;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%);
        }
        .bg-glow-2 {
          position: fixed; bottom: -10%; left: -10%; width: 300px; height: 300px; z-index: -1; border-radius: 50%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
        }
        .logo-container { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-bottom: 1rem; }
        .orbit-icon { position: relative; }
        .icon-glow { position: absolute; inset: 0; background: var(--primary); filter: blur(20px); opacity: 0.3; border-radius: 50%; }
        .title { font-size: 3.5rem; font-weight: 900; background: linear-gradient(to right, #10b981, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .sync-status { display: flex; justify-content: center; align-items: center; }
        .status-pill { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 2rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; }
        .status-dot.green { background: #10b981; box-shadow: 0 0 10px #10b981; }
        .main-layout { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 3rem; }
        .column { display: flex; flex-direction: column; gap: 2rem; }
        .save-button { width: 100%; height: 4.5rem; font-size: 1.25rem; font-weight: 700; border-radius: 1rem; transition: all 0.3s ease; gap: 0.75rem; }
        .glass-small { padding: 1rem; border: 1px solid rgba(255,255,255,0.05); }
        .integrity-check { display: flex; justify-content: space-between; align-items: center; color: #94a3b8; font-size: 0.9rem; }

        @media (max-width: 1024px) {
          .main-layout { grid-template-columns: 1fr; gap: 2rem; }
          .title { font-size: 2.5rem; }
        }
        @media (max-width: 480px) {
          .title { font-size: 2.25rem; }
          .container { padding: 0.75rem; }
        }
      `}</style>
    </div>
  );
}
function BrandOrbit({ size, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" /><path d="M3 3h1v1" /><path d="M20 20h1v1" /><path d="M12 4.5a7.5 7.5 0 1 0 7.5 7.5" /><path d="M12 4.5a3 3 0 1 1 3 3" />
    </svg>
  );
}
