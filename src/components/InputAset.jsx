import React from "react";
import { Plus, Trash2, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InputAset({ assets, setAssets }) {
  const tambahAset = () => {
    setAssets([...assets, { name: "", value: "" }]);
  };

  const handleRemove = (index) => {
    const newAssets = assets.filter((_, i) => i !== index);
    setAssets(newAssets.length > 0 ? newAssets : [{ name: "", value: "" }]);
  };

  const handleChange = (index, field, value) => {
    const newAssets = [...assets];
    newAssets[index][field] = value;
    setAssets(newAssets);
  };

  return (
    <div className="card glass">
      <div className="asset-header">
        <Wallet className="icon-primary" size={20} />
        <h2 className="subtitle">Portfolio Assets</h2>
      </div>
      
      <div className="asset-list">
        <AnimatePresence>
          {assets.map((item, index) => (
            <motion.div 
              key={index} 
              className="asset-item"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="input-group">
                <input
                  placeholder="Asset Name"
                  value={item.name}
                  autoFocus={index === assets.length - 1 && index > 0}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  className="asset-input name"
                />
              </div>
              <div className="input-group">
                <input
                  type="number"
                  placeholder="Value (Rp)"
                  value={item.value}
                  onChange={(e) => handleChange(index, "value", e.target.value)}
                  className="asset-input value"
                />
              </div>
              <button 
                className="btn-remove secondary" 
                onClick={() => handleRemove(index)}
                aria-label="Remove Asset"
                title="Remove Asset"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button 
        onClick={tambahAset} 
        className="btn-add secondary"
      >
        <Plus size={18} /> Add Asset
      </button>

      <style>{`
        .asset-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
        .icon-primary { color: var(--primary); }
        .subtitle { font-size: 1.3rem; font-weight: 700; color: #f8fafc; }
        .input-group { min-width: 0; width: 100%; }
        .asset-input { width: 100% !important; border-radius: 0.5rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); transition: all 0.2s ease; }
        .asset-input:focus { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1); background: rgba(255,255,255,0.05); }
        .btn-remove { padding: 0.75rem; width: auto; height: auto; display: flex; align-items: center; border-radius: 0.5rem; color: #ef4444; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.1); }
        .btn-remove:hover { background: rgba(239, 68, 68, 0.1); border-color: #ef4444; color: #ef4444; }
        .btn-add { margin-top: 1.5rem; width: 100%; border-radius: 0.75rem; background: var(--secondary) !important; color: #94a3b8 !important; border: 1px dashed rgba(255,255,255,0.2) !important; font-weight: 600; padding: 1rem; }
        .btn-add:hover { border-color: var(--primary) !important; color: var(--primary) !important; background: rgba(16, 185, 129, 0.05) !important; }

        @media (max-width: 639px) {
          .asset-item { display: flex; flex-direction: column; align-items: stretch; gap: 1rem; padding: 1.25rem; border: 1px solid rgba(255,255,255,0.05); }
          .btn-remove { width: 100%; justify-content: center; padding: 1rem; }
        }
      `}</style>
    </div>
  );
}
