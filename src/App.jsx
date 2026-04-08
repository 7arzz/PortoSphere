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
  const [lastTotal, setLastTotal] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "portfolio", "user1"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data && data.assets) {
          const freshAssets = data.assets.length > 0 ? data.assets : [{ name: "", value: "" }];
          setAssets(freshAssets);
          setLastTotal(data.assets.reduce((s, a) => s + (a.value || 0), 0));
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

  const currentTotal = assets.reduce(
    (sum, item) => sum + (Number(item.value) || 0),
    0,
  );

  return (
    <div className="container" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Sphere Effects */}
      <div style={{
        position: 'fixed',
        top: '-10%',
        right: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
        zIndex: -1,
        borderRadius: '50%'
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-10%',
        left: '-10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
        zIndex: -1,
        borderRadius: '50%'
      }} />

      <header className="header" style={{ marginBottom: '4rem' }}>
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'relative' }}
          >
             <Orbit size={42} color="var(--primary)" strokeWidth={2.5} />
             <div style={{ 
               position: 'absolute', 
               inset: 0, 
               background: 'var(--primary)', 
               filter: 'blur(15px)', 
               opacity: 0.2, 
               borderRadius: '50%' 
             }} />
          </motion.div>
          <h1 style={{ fontSize: '3rem', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #10b981, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            PortoSphere
          </h1>
        </motion.div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
          <AnimatePresence mode="wait">
            {!loading ? (
              <motion.div 
                key="ready"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                <span>Orbiting Live Database</span>
              </motion.div>
            ) : (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.1rem' }}
              >
                STABILIZING CONNECTION...
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)', gap: '3rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Main Input Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <InputAset assets={assets} setAssets={setAssets} />
          </motion.div>
          
          <motion.div
            whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}
            whileTap={{ scale: 0.98 }}
          >
            <button 
              onClick={saveData} 
              disabled={saving}
              style={{ 
                width: '100%', 
                height: '4.5rem', 
                fontSize: '1.25rem', 
                fontWeight: 700,
                borderRadius: '1rem',
                backgroundColor: saving ? 'var(--secondary)' : 'var(--primary)',
                transition: 'all 0.3s ease'
              }}
            >
              {saving ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ marginRight: '1rem' }}
                  >
                    <RefreshCcw size={24} />
                  </motion.div>
                  Syncing Sphere...
                </>
              ) : (
                <>
                  <ShieldCheck size={24} style={{ marginRight: '0.75rem' }} />
                  Secure Assets to Cloud
                </>
              )}
            </button>
          </motion.div>

          <section className="card glass" style={{ padding: '1.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Cloud Integrity Check</div>
               <Sparkles size={16} color="var(--primary)" />
             </div>
          </section>
        </div>

        <motion.section
          layout
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <Chart assets={assets} isPortoSphere={true} />
        </motion.section>
      </main>
      
      <style>{`
        @media (max-width: 1024px) {
          main {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
