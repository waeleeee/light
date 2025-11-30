import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { LightState } from '../models/murphiModel';

interface ControlPanelProps {
  currentState: LightState;
  isPlaying: boolean;
  lastRule: string | null;
  invariantStatus: 'OK' | 'VIOLATION';
  onNextStep: () => void;
  onAutoPlay: () => void;
  onStop: () => void;
  onReset: () => void;
  onModelCheck: () => void;
}

export const ControlPanel = ({
  currentState,
  isPlaying,
  lastRule,
  invariantStatus,
  onNextStep,
  onAutoPlay,
  onStop,
  onReset,
  onModelCheck,
}: ControlPanelProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Controls</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onNextStep}
              disabled={isPlaying}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <SkipForward size={18} />
              Next Step
            </button>

            <button
              onClick={isPlaying ? onStop : onAutoPlay}
              className={`flex items-center justify-center gap-2 ${
                isPlaying
                  ? 'bg-orange-500 hover:bg-orange-600'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white px-4 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg`}
            >
              {isPlaying ? (
                <>
                  <Pause size={18} />
                  Stop
                </>
              ) : (
                <>
                  <Play size={18} />
                  Auto Play
                </>
              )}
            </button>

            <button
              onClick={onReset}
              className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <RotateCcw size={18} />
              Reset
            </button>

            <button
              onClick={onModelCheck}
              disabled={isPlaying}
              className="flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <Search size={18} />
              Model Check
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Status</h3>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Current State</div>
            <div className="text-2xl font-bold text-gray-900">{currentState}</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Last Rule Applied</div>
            <div className="text-lg font-semibold text-gray-900">
              {lastRule || 'None'}
            </div>
          </div>

          <motion.div
            className={`rounded-lg p-4 border-2 ${
              invariantStatus === 'OK'
                ? 'bg-green-50 border-green-500'
                : 'bg-red-50 border-red-500'
            }`}
            animate={
              invariantStatus === 'VIOLATION'
                ? { scale: [1, 1.05, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 0.5, repeat: invariantStatus === 'VIOLATION' ? Infinity : 0 }}
          >
            <div className="flex items-center gap-2">
              {invariantStatus === 'OK' ? (
                <CheckCircle className="text-green-600" size={20} />
              ) : (
                <AlertCircle className="text-red-600" size={20} />
              )}
              <div className="text-sm font-bold">Invariant Status</div>
            </div>
            <div
              className={`text-xl font-black mt-1 ${
                invariantStatus === 'OK' ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {invariantStatus === 'OK' ? 'OK' : 'VIOLATION DETECTED!'}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
