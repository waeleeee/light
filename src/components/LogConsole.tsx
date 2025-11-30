import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';

interface LogEntry {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  timestamp: number;
}

interface LogConsoleProps {
  logs: LogEntry[];
}

export const LogConsole = ({ logs }: LogConsoleProps) => {
  const getLogColor = (type: string) => {
    const colors = {
      info: 'text-blue-400',
      success: 'text-green-400',
      error: 'text-red-400',
      warning: 'text-yellow-400',
    };
    return colors[type as keyof typeof colors] || 'text-gray-400';
  };

  const getLogIcon = (type: string) => {
    const icons = {
      info: '→',
      success: '✓',
      error: '✗',
      warning: '⚠',
    };
    return icons[type as keyof typeof icons] || '•';
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-lg h-64 overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
        <Terminal size={18} className="text-green-400" />
        <h3 className="text-sm font-bold text-gray-300">Execution Log</h3>
      </div>
      <div className="flex-1 overflow-y-auto font-mono text-xs space-y-1">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`${getLogColor(log.type)} flex items-start gap-2`}
            >
              <span className="opacity-50">
                [{new Date(log.timestamp).toLocaleTimeString()}]
              </span>
              <span>{getLogIcon(log.type)}</span>
              <span className="flex-1">{log.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
