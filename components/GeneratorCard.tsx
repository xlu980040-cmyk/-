import React, { useState, useCallback } from 'react';
import { generateAvatarImage } from '../services/gemini';
import { Loader2, Send, Download, RefreshCw, AlertCircle, Sparkles, Share2 } from 'lucide-react';

export const GeneratorCard: React.FC = () => {
  const [name, setName] = useState('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!name.trim()) return;

    setLoading(true);
    setError(null);
    setImageSrc(null);

    try {
      const base64Image = await generateAvatarImage(name);
      setImageSrc(base64Image);
    } catch (err) {
      setError("Failed to generate image. Please try again or check your API key.");
    } finally {
      setLoading(false);
    }
  }, [name]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleGenerate();
    }
  };

  const handleDownload = () => {
    if (!imageSrc) return;
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `${name.replace(/\s+/g, '_')}_avatar.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!imageSrc) return;

    try {
      // Fetch the image from the base64 source to create a blob
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      const file = new File([blob], `${name.replace(/\s+/g, '_')}_avatar.png`, { type: 'image/png' });

      const shareData = {
        title: `Avatar for ${name}`,
        text: `Check out this avatar generated for ${name}!`,
        files: [file],
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support file sharing
        // On mobile it usually works, on desktop it might not
        alert("Sharing is not supported on this specific device/browser. Please use the Download button!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Input Section */}
        <div className="space-y-2">
          <label htmlFor="nameInput" className="block text-sm font-medium text-slate-300 ml-1">
            Who are we generating for?
          </label>
          <div className="relative group">
            <input
              id="nameInput"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a name (e.g. 郭晓)"
              className="w-full bg-slate-900/60 border border-slate-600 text-slate-100 rounded-xl px-4 py-4 pr-12 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-slate-600"
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !name.trim()}
              className="absolute right-2 top-2 bottom-2 p-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 text-white rounded-lg transition-colors flex items-center justify-center aspect-square"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Image Display Area */}
        <div className={`
          relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-900/40 border-2 border-dashed border-slate-700
          flex items-center justify-center transition-all duration-500
          ${imageSrc ? 'border-none shadow-inner' : ''}
        `}>
          
          {!imageSrc && !loading && (
            <div className="text-center text-slate-500">
              <div className="w-16 h-16 bg-slate-800 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Sparkles className="w-8 h-8 opacity-50" />
              </div>
              <p className="text-sm">Image will appear here</p>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm">
              <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-3" />
              <p className="text-purple-300 font-medium animate-pulse">Dreaming up visuals...</p>
            </div>
          )}

          {imageSrc && (
            <div className="relative w-full h-full group">
              <img 
                src={imageSrc} 
                alt={`Avatar for ${name}`} 
                className="w-full h-full object-cover animate-in zoom-in-95 duration-500"
              />
              
              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-[2px]">
                <button 
                  onClick={handleDownload}
                  className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
                  title="Download Image"
                >
                  <Download className="w-6 h-6" />
                </button>

                <button 
                  onClick={handleShare}
                  className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
                  title="Share Image"
                >
                  <Share2 className="w-6 h-6" />
                </button>

                <button 
                  onClick={handleGenerate}
                  className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
                  title="Regenerate"
                >
                  <RefreshCw className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Caption */}
        {imageSrc && name.trim() === '郭晓' && (
           <div className="text-center animate-in slide-in-from-bottom-2 fade-in duration-700">
             <span className="inline-block px-3 py-1 rounded-full bg-green-900/30 text-green-400 border border-green-500/30 text-xs font-bold uppercase tracking-wider">
               👑 The Bitter Melon King
             </span>
           </div>
        )}

      </div>
    </div>
  );
};