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
      <div className="flex items-center gap-2 mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Wallet className="w-5 h-5 text-primary" size={20} color="var(--primary)" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Portfolio Assets</h2>
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
              <input
                placeholder="Asset Name (e.g. BTC, Stocks)"
                value={item.name}
                autoFocus={index === assets.length - 1 && index > 0}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
              <input
                type="number"
                placeholder="Value (Rp)"
                value={item.value}
                onChange={(e) => handleChange(index, "value", e.target.value)}
              />
              <button 
                className="secondary" 
                onClick={() => handleRemove(index)}
                style={{ padding: '0.75rem', width: 'auto' }}
                title="Remove Asset"
                aria-label="Remove Asset"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button 
        onClick={tambahAset} 
        style={{ marginTop: "1.5rem", width: "100%", backgroundColor: "var(--secondary)" }}
        className="secondary"
      >
        <Plus size={18} /> Add Asset
      </button>
    </div>
  );
}
