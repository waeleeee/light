import { motion } from 'framer-motion';
import { LightState } from '../models/murphiModel';

interface StateTimelineProps {
  states: LightState[];
}

export const StateTimeline = ({ states }: StateTimelineProps) => {
  const getStateColor = (state: LightState) => {
    const colors = {
      RED: 'bg-red-500 border-red-600',
      YELLOW: 'bg-yellow-400 border-yellow-600',
      GREEN: 'bg-green-500 border-green-600',
    };
    return colors[state];
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4">⏱️ Chronologie d'État</h3>
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {states.map((state, index) => (
          <div key={index} className="flex items-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={`w-12 h-12 rounded-lg ${getStateColor(state)} border-2 flex items-center justify-center shadow-md`}
              >
                <span className="text-white text-xs font-bold">
                  {state[0]}
                </span>
              </div>
              <span className="text-xs text-gray-600 font-mono">#{index}</span>
            </motion.div>
            {index < states.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.1 + 0.05 }}
                className="w-8 h-0.5 bg-gray-400 mx-1"
                style={{ originX: 0 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
