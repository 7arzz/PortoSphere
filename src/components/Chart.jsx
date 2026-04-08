import React, { useRef, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { PieChart, List, Target, Shield, Camera, Download, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Chart({ assets, isPortoSphere }) {
  const cardRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  
  const filteredAssets = assets.filter(item => item.name && Number(item.value) > 0);
  const total = filteredAssets.reduce((sum, item) => sum + (Number(item.value) || 0), 0);

  const takeSnapshot = async () => {
    if (!cardRef.current) return;
    setCapturing(true);
    
    try {
      // Adding a small delay to ensure all animations are finished
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0f172a', // Match background
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
      });
      
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.download = `PortoSphere-Shot-${new Date().getTime()}.png`;
      link.href = image;
      link.click();
    } catch (err) {
      console.error("Snapshot failed:", err);
    } finally {
      setCapturing(false);
    }
  };

  const data = {
    labels: filteredAssets.map(item => item.name),
    datasets: [
      {
        label: 'Sphere Distribution',
        data: filteredAssets.map(item => Number(item.value)),
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(236, 72, 153, 0.7)',
          'rgba(20, 184, 166, 0.7)',
          'rgba(101, 163, 13, 0.7)',
          'rgba(217, 70, 239, 0.7)',
        ],
        borderColor: '#1e293b',
        borderWidth: 4,
        hoverOffset: 15,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          padding: 24,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 12, family: "'Inter', sans-serif", weight: 500 }
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 14,
        cornerRadius: 12,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1);
            return ` Rp ${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div ref={cardRef} className="card glass" style={{ minHeight: '530px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Target className="w-5 h-5 text-primary" size={24} color="var(--primary)" />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9' }}>Wealth Sphere</h2>
        </div>
        
        {/* SNAPSHOT BUTTON */}
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
          whileTap={{ scale: 0.95 }}
          onClick={takeSnapshot}
          disabled={capturing || filteredAssets.length === 0}
          style={{ 
            padding: '0.6rem', 
            background: 'transparent', 
            border: '1px solid var(--border)', 
            width: 'auto', 
            borderRadius: '0.75rem', 
            cursor: filteredAssets.length > 0 ? 'pointer' : 'not-allowed',
            opacity: filteredAssets.length > 0 ? 1 : 0.3
          }}
          title="Take Sphere Shot"
        >
          {capturing ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
              <Loader2 size={18} color="var(--primary)" />
            </motion.div>
          ) : (
            <Camera size={18} color="var(--primary)" />
          )}
        </motion.button>
      </div>

      <div className="chart-container" style={{ position: 'relative', height: '360px' }}>
        {filteredAssets.length > 0 ? (
          <>
            <Pie data={data} options={options} />
            <div style={{ 
              position: 'absolute', 
              top: '44%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              textAlign: 'center',
              pointerEvents: 'none',
              marginTop: '-5px'
            }}>
               <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
                 <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Net Worth</span>
                 <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f8fafc', whiteSpace: 'nowrap' }}>
                    Rp {total.toLocaleString()}
                 </span>
               </motion.div>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#475569' }}>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
              <Orbit size={64} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
            </motion.div>
            <p style={{ maxWidth: '180px', textAlign: 'center', fontSize: '0.9rem' }}>Initiated assets required for Sphere visualization</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {total > 0 && !capturing && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <Shield size={16} color="#10b981" />
               <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#10b981' }}>SAFE & SECURE</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
               <Download size={12} /> Sync: Enabled
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Snapshot Overlay for feedback */}
      <AnimatePresence>
        {capturing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'rgba(16, 185, 129, 0.1)', 
              backdropFilter: 'blur(4px)', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              zIndex: 10
            }}
          >
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
               <Camera size={48} />
               <p style={{ fontWeight: 700 }}>Processing Sphere-Shot...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Orbit({ size, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" /><path d="M3 3h1v1" /><path d="M20 20h1v1" /><path d="M12 4.5a7.5 7.5 0 1 0 7.5 7.5" /><path d="M12 4.5a3 3 0 1 1 3 3" />
    </svg>
  );
}
