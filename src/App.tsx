import { useState, useEffect, useRef } from 'react';
import { TrafficLight } from './components/TrafficLight';
import { MurphiRules } from './components/MurphiRules';
import { StateTimeline } from './components/StateTimeline';
import { LogConsole } from './components/LogConsole';
import { ControlPanel } from './components/ControlPanel';
import { murphiModel, LightState } from './models/murphiModel';

interface LogEntry {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  timestamp: number;
}

function App() {
  const [currentState, setCurrentState] = useState<LightState>('RED');
  const [stateHistory, setStateHistory] = useState<LightState[]>(['RED']);
  const [lastRule, setLastRule] = useState<string | null>(null);
  const [invariantStatus, setInvariantStatus] = useState<'OK' | 'VIOLATION'>('OK');
  const [isPlaying, setIsPlaying] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 0,
      message: 'Murphi Traffic Light Simulator initialized',
      type: 'success',
      timestamp: Date.now(),
    },
    {
      id: 1,
      message: 'Initial state: RED',
      type: 'info',
      timestamp: Date.now(),
    },
  ]);

  const logIdCounter = useRef(2);
  const intervalRef = useRef<number | null>(null);

  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const newLog: LogEntry = {
      id: logIdCounter.current++,
      message,
      type,
      timestamp: Date.now(),
    };
    setLogs((prev) => [...prev, newLog].slice(-50));
  };

  const executeNextStep = () => {
    const { nextState, appliedRule } = murphiModel.applyRule(currentState);

    if (appliedRule) {
      setCurrentState(nextState);
      setStateHistory((prev) => [...prev, nextState]);
      setLastRule(appliedRule.name);

      addLog(`Applied Rule: ${appliedRule.name}`, 'info');
      addLog(`Transition: ${currentState} → ${nextState}`, 'success');

      const invariantCheck = murphiModel.checkInvariant(nextState);
      if (invariantCheck.valid) {
        setInvariantStatus('OK');
        addLog('Invariant OK', 'success');
      } else {
        setInvariantStatus('VIOLATION');
        addLog(`INVARIANT VIOLATION: ${invariantCheck.violations.join(', ')}`, 'error');
      }
    } else {
      addLog('No applicable rule found', 'warning');
    }
  };

  const handleNextStep = () => {
    if (!isPlaying) {
      executeNextStep();
    }
  };

  const handleAutoPlay = () => {
    setIsPlaying(true);
    addLog('Auto-play started', 'info');
  };

  const handleStop = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    addLog('Auto-play stopped', 'info');
  };

  const handleReset = () => {
    handleStop();
    setCurrentState('RED');
    setStateHistory(['RED']);
    setLastRule(null);
    setInvariantStatus('OK');
    addLog('System reset to initial state', 'warning');
  };

  const handleModelCheck = () => {
    addLog('Running model checker...', 'info');

    const result = murphiModel.runModelCheck();

    addLog(`Model check completed`, 'success');
    addLog(`Visited ${result.visitedStates.length} states`, 'info');
    addLog(`Executed ${result.transitions.length} transitions`, 'info');

    if (result.violations.length === 0) {
      addLog('No violations found', 'success');
    } else {
      addLog(`Found ${result.violations.length} violations`, 'error');
      result.violations.forEach((violation) => {
        addLog(`Violation: ${violation}`, 'error');
      });
    }

    setStateHistory(result.visitedStates);
    setCurrentState(result.visitedStates[result.visitedStates.length - 1]);
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        executeNextStep();
      }, 1500);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-gray-900 mb-3">
            Murphi Traffic Light Simulator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            An interactive demonstration of formal verification using the Murphi model checker.
            Watch as the system verifies state transitions and enforces invariants in real-time.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
            <span className="bg-blue-100 px-3 py-1 rounded-full font-semibold">
              Formal Verification
            </span>
            <span className="bg-green-100 px-3 py-1 rounded-full font-semibold">
              Model Checking
            </span>
            <span className="bg-purple-100 px-3 py-1 rounded-full font-semibold">
              State Exploration
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1 flex items-center justify-center">
            <TrafficLight currentState={currentState} />
          </div>

          <div className="lg:col-span-2">
            <MurphiRules activeRule={lastRule} />
          </div>
        </div>

        <div className="mb-6">
          <StateTimeline states={stateHistory} />
        </div>

        <div className="mb-6">
          <ControlPanel
            currentState={currentState}
            isPlaying={isPlaying}
            lastRule={lastRule}
            invariantStatus={invariantStatus}
            onNextStep={handleNextStep}
            onAutoPlay={handleAutoPlay}
            onStop={handleStop}
            onReset={handleReset}
            onModelCheck={handleModelCheck}
          />
        </div>

        <div>
          <LogConsole logs={logs} />
        </div>
      </div>
    </div>
  );
}

export default App;
