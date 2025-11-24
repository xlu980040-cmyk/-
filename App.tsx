import React from 'react';
import { GeneratorCard } from './components/GeneratorCard';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      
      <header className="mb-8 text-center sm:mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-purple-500/20 rounded-2xl ring-1 ring-purple-500/50 backdrop-blur-sm">
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 tracking-tight mb-2">
          Avatar Magic
        </h1>
        <p className="text-slate-400 text-lg max-w-md mx-auto">
          Enter a name to reveal its hidden visual persona.
        </p>
      </header>

      <main className="w-full max-w-lg">
        <GeneratorCard />
      </main>

      <footer className="mt-12 text-slate-500 text-sm">
        <p>Powered by Gemini 2.5 Flash Image</p>
      </footer>
    </div>
  );
};

export default App;