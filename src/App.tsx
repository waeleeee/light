import { useState, useEffect, useRef } from 'react';
import { TrafficLight } from './components/TrafficLight';
import { MurphiRules } from './components/MurphiRules';
import { StateTimeline } from './components/StateTimeline';
import { LogConsole } from './components/LogConsole';
import { ControlPanel } from './components/ControlPanel';
import { murphiModel, LightState, DemoMode, DemoScenario } from './models/murphiModel';

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
  const [demoMode, setDemoMode] = useState<DemoMode>('normal');
  const [currentScenario, setCurrentScenario] = useState<DemoScenario>(murphiModel.demoScenarios.normal);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 0,
      message: 'Simulateur de Feu Tricolore Murphi initialisé',
      type: 'success',
      timestamp: Date.now(),
    },
    {
      id: 1,
      message: 'État initial: ROUGE',
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

  const handleDemoModeChange = (mode: DemoMode) => {
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    setDemoMode(mode);
    const scenario = murphiModel.demoScenarios[mode];
    setCurrentScenario(scenario);
    
    setCurrentState('RED');
    setStateHistory(['RED']);
    setLastRule(null);
    setInvariantStatus('OK');
    
    addLog(`Passage à: ${scenario.name}`, 'warning');
    addLog(scenario.description, 'info');
  };

  const executeNextStep = () => {
    const { nextState, appliedRule } = murphiModel.applyRule(currentState, currentScenario.rules);

    if (appliedRule) {
      setCurrentState(nextState);
      setStateHistory((prev) => [...prev, nextState]);
      setLastRule(appliedRule.name);

      addLog(`Règle appliquée: ${appliedRule.name}`, 'info');
      addLog(`Transition: ${currentState} → ${nextState}`, 'success');

      const invariantCheck = murphiModel.checkInvariant(nextState, currentScenario.invariants, stateHistory.length);
      if (invariantCheck.valid) {
        setInvariantStatus('OK');
        addLog('Invariant OK ✓', 'success');
      } else {
        setInvariantStatus('VIOLATION');
        addLog(`⚠️  VIOLATION D'INVARIANT: ${invariantCheck.violations.join(', ')}`, 'error');
      }
    } else {
      addLog('Aucune règle applicable - Système arrêté', 'error');
    }
  };

  const handleNextStep = () => {
    if (!isPlaying) {
      executeNextStep();
    }
  };

  const handleAutoPlay = () => {
    setIsPlaying(true);
    addLog('Lecture automatique démarrée', 'info');
  };

  const handleStop = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    addLog('Lecture automatique arrêtée', 'info');
  };

  const handleReset = () => {
    handleStop();
    setCurrentState('RED');
    setStateHistory(['RED']);
    setLastRule(null);
    setInvariantStatus('OK');
    addLog('Système réinitialisé à l\'état initial', 'warning');
  };

  const handleModelCheck = () => {
    addLog(`Exécution du vérificateur de modèle sur ${currentScenario.name}...`, 'info');

    const result = murphiModel.runModelCheck(currentScenario);

    addLog(`✓ Vérification de modèle terminée`, 'success');
    addLog(`${result.visitedStates.length} états visités`, 'info');
    addLog(`${result.transitions.length} transitions exécutées`, 'info');

    if (result.violations.length === 0) {
      addLog('✓ Aucune violation trouvée - Les invariants sont vérifiés!', 'success');
    } else {
      addLog(`⚠️  ${result.violations.length} violations trouvées`, 'error');
      result.violations.forEach((violation) => {
        addLog(`Violation: ${violation}`, 'error');
      });
    }

    setStateHistory(result.visitedStates);
    setCurrentState(result.visitedStates[result.visitedStates.length - 1]);
  };

  useEffect(() => {
    let isMounted = true;

    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        if (isMounted) {
          // Execute step inline to avoid dependency issues
          const { nextState, appliedRule } = murphiModel.applyRule(currentState, currentScenario.rules);

          if (appliedRule) {
            setCurrentState(nextState);
            setStateHistory((prev) => [...prev, nextState]);
            setLastRule(appliedRule.name);

            addLog(`Règle appliquée: ${appliedRule.name}`, 'info');
            addLog(`Transition: ${currentState} → ${nextState}`, 'success');

            const invariantCheck = murphiModel.checkInvariant(nextState, currentScenario.invariants);
            if (invariantCheck.valid) {
              setInvariantStatus('OK');
              addLog('Invariant OK ✓', 'success');
            } else {
              setInvariantStatus('VIOLATION');
              addLog(`⚠️  VIOLATION D'INVARIANT: ${invariantCheck.violations.join(', ')}`, 'error');
            }
          } else {
            addLog('Aucune règle applicable - Système arrêté', 'error');
          }
        }
      }, 1500);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      isMounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentState, currentScenario]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-black text-gray-900">
            🚦 Simulateur de Feu Tricolore Murphi
          </h1>
          <p className="text-gray-600 mt-2">
            Vérification formelle et détection de violations
          </p>
        </div>
      </header>

      {/* Main Content - Single Page */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Section 1: Main Display - Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Traffic Light */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col items-center justify-center">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Feu Tricolore</h2>
              <TrafficLight currentState={currentState} />
            </div>
          </div>

          {/* Murphi Rules */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Règles de Murphi</h2>
              <MurphiRules activeRule={lastRule} scenario={currentScenario} />
            </div>
          </div>

          {/* Status Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
              <h2 className="text-lg font-bold text-gray-800 mb-4">État du Système</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-xs font-semibold text-gray-600 mb-1">ÉTAT COURANT</div>
                  <div className="text-3xl font-bold text-blue-600">{currentState}</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-xs font-semibold text-gray-600 mb-1">DERNIÈRE RÈGLE</div>
                  <div className="text-sm font-semibold text-gray-800 break-words h-12 overflow-y-auto">
                    {lastRule || '—'}
                  </div>
                </div>

                <div className={`rounded-lg p-4 border-2 transition-all ${
                  invariantStatus === 'OK'
                    ? 'bg-green-50 border-green-400'
                    : 'bg-red-50 border-red-400 animate-pulse'
                }`}>
                  <div className={`text-xs font-bold mb-1 ${
                    invariantStatus === 'OK' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    INVARIANT
                  </div>
                  <div className={`text-xl font-black ${
                    invariantStatus === 'OK' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {invariantStatus === 'OK' ? '✓ OK' : '✗ VIOLATION'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Contrôles et Scénarios</h2>
          <ControlPanel
            isPlaying={isPlaying}
            currentDemoMode={demoMode}
            onNextStep={handleNextStep}
            onAutoPlay={handleAutoPlay}
            onStop={handleStop}
            onReset={handleReset}
            onModelCheck={handleModelCheck}
            onDemoModeChange={handleDemoModeChange}
          />
        </div>

        {/* Section 3: Timeline and Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* State Timeline */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Chronologie d'État</h2>
            <StateTimeline states={stateHistory} />
          </div>

          {/* Log Console */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Console de Journalisation</h2>
            <LogConsole logs={logs} />
          </div>
        </div>

        {/* Section 4: Current Scenario Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 border-2 border-blue-200">
          <h2 className="text-lg font-bold text-gray-800 mb-2">📋 Scénario Actuel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">NOM DU SCÉNARIO</p>
              <p className="text-2xl font-bold text-blue-600">{currentScenario.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">DESCRIPTION</p>
              <p className="text-base text-gray-700">{currentScenario.description}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            Simulateur Murphi - Vérification Formelle des Systèmes © 2025
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Détection automatique de violations et de blocages
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
