import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, Search, CheckCircle, AlertTriangle, Lock } from 'lucide-react';
import { DemoMode } from '../models/murphiModel';

interface ControlPanelProps {
  currentDemoMode: DemoMode;
  isPlaying: boolean;
  onNextStep: () => void;
  onAutoPlay: () => void;
  onStop: () => void;
  onReset: () => void;
  onModelCheck: () => void;
  onDemoModeChange: (mode: DemoMode) => void;
}

export const ControlPanel = ({
  isPlaying,
  onNextStep,
  onAutoPlay,
  onStop,
  onReset,
  onModelCheck,
  currentDemoMode,
  onDemoModeChange,
}: ControlPanelProps) => {
  return (
    <div className="space-y-6">
      {/* Control Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <motion.button
          onClick={onNextStep}
          disabled={isPlaying}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-all shadow-md"
        >
          <SkipForward size={18} />
          Étape Suivante
        </motion.button>

        <motion.button
          onClick={isPlaying ? onStop : onAutoPlay}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center justify-center gap-2 ${
            isPlaying
              ? 'bg-orange-500 hover:bg-orange-600'
              : 'bg-green-500 hover:bg-green-600'
          } text-white px-4 py-3 rounded-lg font-semibold transition-all shadow-md`}
        >
          {isPlaying ? (
            <>
              <Pause size={18} />
              Arrêter
            </>
          ) : (
            <>
              <Play size={18} />
              Lecture Auto
            </>
          )}
        </motion.button>

        <motion.button
          onClick={onReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-all shadow-md"
        >
          <RotateCcw size={18} />
          Réinitialiser
        </motion.button>

        <motion.button
          onClick={onModelCheck}
          disabled={isPlaying}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-all shadow-md"
        >
          <Search size={18} />
          Vérifier Modèle
        </motion.button>
      </div>

      {/* Demo Scenarios */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          ⚡ Scénarios de Démonstration - Montrez les Règles de Murphi!
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            onClick={() => onDemoModeChange('normal')}
            className={`p-4 rounded-lg border-2 transition-all font-semibold ${
              currentDemoMode === 'normal'
                ? 'bg-green-100 border-green-500 text-green-800'
                : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-green-400'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle size={18} />
              Fonctionnement Normal
            </div>
            <div className="text-xs text-gray-600">
              Cycle standard du feu tricolore
            </div>
          </motion.button>

          <motion.button
            onClick={() => onDemoModeChange('violation')}
            className={`p-4 rounded-lg border-2 transition-all font-semibold ${
              currentDemoMode === 'violation'
                ? 'bg-red-100 border-red-500 text-red-800'
                : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-red-400'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={18} />
              Scénario de Violation
            </div>
            <div className="text-xs text-gray-600">
              Affiche les invariants brisés
            </div>
          </motion.button>

          <motion.button
            onClick={() => onDemoModeChange('deadlock')}
            className={`p-4 rounded-lg border-2 transition-all font-semibold ${
              currentDemoMode === 'deadlock'
                ? 'bg-orange-100 border-orange-500 text-orange-800'
                : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-orange-400'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Lock size={18} />
              Scénario de Blocage
            </div>
            <div className="text-xs text-gray-600">
              Le système se bloque
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
