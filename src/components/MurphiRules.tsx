import { motion } from 'framer-motion';
import { murphiModel, MurphiRule } from '../models/murphiModel';

interface MurphiRulesProps {
  activeRule: string | null;
}

export const MurphiRules = ({ activeRule }: MurphiRulesProps) => {
  return (
    <div className="bg-gray-900 rounded-lg p-6 h-full shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <h3 className="text-lg font-bold text-white ml-2">Murphi Rules</h3>
      </div>

      <div className="space-y-4 font-mono text-sm">
        {murphiModel.rules.map((rule: MurphiRule) => (
          <motion.div
            key={rule.id}
            className={`p-4 rounded-lg border-2 transition-all duration-300 ${
              activeRule === rule.name
                ? 'bg-blue-900 border-blue-400 shadow-lg shadow-blue-500/50'
                : 'bg-gray-800 border-gray-700'
            }`}
            animate={
              activeRule === rule.name
                ? {
                    scale: [1, 1.02, 1],
                  }
                : { scale: 1 }
            }
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`font-bold ${
                  activeRule === rule.name ? 'text-blue-300' : 'text-gray-400'
                }`}
              >
                Rule: {rule.name}
              </span>
              {activeRule === rule.name && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full"
                >
                  ACTIVE
                </motion.span>
              )}
            </div>
            <pre
              className={`whitespace-pre-wrap ${
                activeRule === rule.name ? 'text-blue-200' : 'text-gray-300'
              }`}
            >
              {rule.description}
            </pre>
          </motion.div>
        ))}

        <div className="mt-6 p-4 bg-purple-900 border-2 border-purple-600 rounded-lg">
          <div className="font-bold text-purple-300 mb-2">Invariant</div>
          <pre className="text-purple-200 whitespace-pre-wrap">
            {murphiModel.invariants[0].description}
          </pre>
        </div>
      </div>
    </div>
  );
};
