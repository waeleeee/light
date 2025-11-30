import { motion } from 'framer-motion';
import { LightState } from '../models/murphiModel';

interface TrafficLightProps {
  currentState: LightState;
}

export const TrafficLight = ({ currentState }: TrafficLightProps) => {
  const getLightStyle = (color: LightState) => {
    const isActive = currentState === color;

    const baseColors = {
      RED: isActive ? 'bg-red-500' : 'bg-red-900',
      YELLOW: isActive ? 'bg-yellow-400' : 'bg-yellow-900',
      GREEN: isActive ? 'bg-green-500' : 'bg-green-900',
    };

    return baseColors[color];
  };

  const getLightGlow = (color: LightState) => {
    const isActive = currentState === color;

    if (!isActive) return '';

    const glows = {
      RED: 'shadow-[0_0_40px_10px_rgba(239,68,68,0.7)]',
      YELLOW: 'shadow-[0_0_40px_10px_rgba(250,204,21,0.7)]',
      GREEN: 'shadow-[0_0_40px_10px_rgba(34,197,94,0.7)]',
    };

    return glows[color];
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-900 rounded-3xl p-8 shadow-2xl border-4 border-gray-700">
        <div className="flex flex-col gap-6">
          {(['RED', 'YELLOW', 'GREEN'] as LightState[]).map((color) => (
            <motion.div
              key={color}
              className={`w-32 h-32 rounded-full ${getLightStyle(color)} ${getLightGlow(color)} border-4 border-gray-800 transition-all duration-300`}
              animate={
                currentState === color
                  ? {
                      scale: [1, 1.1, 1],
                      opacity: [0.9, 1, 0.9],
                    }
                  : { scale: 1, opacity: 0.3 }
              }
              transition={{
                duration: 1.5,
                repeat: currentState === color ? Infinity : 0,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
      <div className="mt-6 text-center">
        <div className="text-2xl font-bold text-gray-800">Current State</div>
        <motion.div
          key={currentState}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-4xl font-black mt-2 ${
            currentState === 'RED'
              ? 'text-red-500'
              : currentState === 'YELLOW'
              ? 'text-yellow-500'
              : 'text-green-500'
          }`}
        >
          {currentState}
        </motion.div>
      </div>
    </div>
  );
};
