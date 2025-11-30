# Technical Implementation - Demo Scenarios

## Architecture Overview

### New Types Added

```typescript
export type DemoMode = "normal" | "violation" | "deadlock";

export interface DemoScenario {
  name: string;
  description: string;
  rules: MurphiRule[];
  invariants: MurphiInvariant[];
}
```

---

## Demo Scenarios Breakdown

### 1. Normal Operation Scenario

**Rules:**
```typescript
{
  RED_TO_GREEN: { state = RED => state := GREEN; }
  GREEN_TO_YELLOW: { state = GREEN => state := YELLOW; }
  YELLOW_TO_RED: { state = YELLOW => state := RED; }
}
```

**Invariants:**
```typescript
SINGLE_LIGHT_ACTIVE: activeCount = 1;
```

**Execution Trace:**
```
RED → GREEN → YELLOW → RED → GREEN → ...
[OK] [OK]    [OK]      [OK]   [OK]
```

---

### 2. Violation Scenario

**Broken Rules (Demonstrating Invalid Sequences):**
```typescript
{
  RED_TO_YELLOW: { 
    state = RED => state := YELLOW; // ❌ SKIPS GREEN!
  }
  YELLOW_TO_GREEN: { 
    state = YELLOW => state := GREEN; // ❌ WRONG ORDER!
  }
  GREEN_TO_RED: { 
    state = GREEN => state := RED; // ❌ SKIPS YELLOW!
  }
}
```

**Broken Invariant:**
```typescript
PROPER_SEQUENCE: {
  check: (state) => false; // Forces violation detection
  // Represents: "Sequence must be RED → GREEN → YELLOW → RED"
}
```

**Execution Trace:**
```
RED → YELLOW → GREEN → RED → ...
[✗]   [✗]     [✗]    [✗]
  ↑
VIOLATION: PROPER_SEQUENCE
```

**Why It Fails:**
- Traditional traffic light rules enforce a strict sequence
- Skipping colors violates the mathematical invariant
- Murphi detects this immediately on the first transition

---

### 3. Deadlock Scenario

**Rules (One Creates Deadlock):**
```typescript
{
  RED_TO_GREEN: { 
    state = RED => state := GREEN; // ✓ Works once
  }
  STUCK_IN_GREEN: { 
    state = GREEN => state := GREEN; // ❌ SELF-LOOP = DEADLOCK!
  }
}
```

**Broken Invariant:**
```typescript
NO_DEADLOCK: {
  check: (state, activeCount, stepCount) => {
    // Detects if stuck in GREEN after step 2
    return !(stepCount > 1 && state === "GREEN");
  }
}
```

**Execution Trace:**
```
RED → GREEN → GREEN → GREEN → ...
[OK]  [OK]   [✗]    [✗]
        ↑
    DEADLOCK: System stuck!
```

**Why It's Deadlocked:**
- After RED→GREEN transition, system can only self-loop
- No rule allows GREEN→YELLOW or GREEN→RED
- System cannot make progress or return to initial state
- This is a classic deadlock pattern

---

## Code Integration

### murphiModel.ts Enhancements

```typescript
// Demo scenarios object
demoScenarios: {
  normal: DemoScenario,
  violation: DemoScenario,
  deadlock: DemoScenario
}

// Enhanced applyRule with scenario support
applyRule: (
  currentState: LightState, 
  rules?: MurphiRule[] // Optional: use scenario rules
): { nextState: LightState; appliedRule: MurphiRule | null }

// Enhanced checkInvariant with scenario support
checkInvariant: (
  state: LightState,
  invariants?: MurphiInvariant[], // Optional: use scenario invariants
  stepCount?: number // For deadlock detection
): { valid: boolean; violations: string[] }

// Enhanced runModelCheck for full verification
runModelCheck: (
  scenario?: DemoScenario // Optional: check specific scenario
): ModelCheckResult
```

### App.tsx State Management

```typescript
const [demoMode, setDemoMode] = useState<DemoMode>('normal');
const [currentScenario, setCurrentScenario] = useState<DemoScenario>(
  murphiModel.demoScenarios.normal
);

const handleDemoModeChange = (mode: DemoMode) => {
  // 1. Stop any running execution
  // 2. Switch to new scenario
  // 3. Reset state to initial RED
  // 4. Log scenario switch
  // 5. Update rules and invariants
}
```

### ControlPanel.tsx UI Changes

**New Demo Mode Buttons:**
```tsx
<motion.button onClick={() => onDemoModeChange('normal')}>
  Normal Operation
</motion.button>
<motion.button onClick={() => onDemoModeChange('violation')}>
  Violation Scenario
</motion.button>
<motion.button onClick={() => onDemoModeChange('deadlock')}>
  Deadlock Scenario
</motion.button>
```

**Visual Feedback:**
- Selected button: colored background + border
- Icon indicators: ✓ (normal), ⚠️ (violation), 🔒 (deadlock)
- Description text for each mode

---

## Execution Flow

### Step-by-Step with Violation Scenario

1. **User clicks "Violation Scenario"**
   ```
   handleDemoModeChange('violation')
   → setCurrentScenario(murphiModel.demoScenarios.violation)
   → Reset state to RED
   → Log: "Switched to: Violation Scenario"
   ```

2. **User clicks "Next Step"**
   ```
   executeNextStep()
   → murphiModel.applyRule(RED, violationRules)
     → Finds RED_TO_YELLOW rule
     → Returns nextState: YELLOW
   → checkInvariant(YELLOW, violationInvariants, step: 1)
     → Runs PROPER_SEQUENCE check
     → Returns: { valid: false, violations: ['PROPER_SEQUENCE'] }
   → setInvariantStatus('VIOLATION')
   → addLog('⚠️ INVARIANT VIOLATION: PROPER_SEQUENCE', 'error')
   ```

3. **UI Updates**
   - Invariant Status box turns RED
   - Log shows violation warning
   - Current rule shown as ACTIVE
   - State transitions displayed

---

## Model Checking Algorithm

```typescript
runModelCheck(scenario) {
  const visitedStates = [RED];
  const transitions = [];
  const violations = [];
  
  let currentState = RED;
  
  for (let step = 0; step < MAX_STEPS; step++) {
    // Find applicable rule
    const rule = scenario.rules.find(r => r.guard(currentState));
    
    if (!rule) break; // Deadlock: no rule applicable
    
    // Apply transition
    const nextState = rule.action(currentState);
    
    // Check invariants
    const check = checkInvariant(nextState, scenario.invariants, step);
    
    // Record transition
    transitions.push({
      fromState: currentState,
      toState: nextState,
      rule: rule.name,
      status: check.valid ? OK : VIOLATION
    });
    
    // Track violations
    if (!check.valid) {
      violations.push(...check.violations);
    }
    
    visitedStates.push(nextState);
    currentState = nextState;
  }
  
  return { visitedStates, transitions, violations, complete: true };
}
```

---

## Logging Output Examples

### Normal Operation
```
Applied Rule: RED_TO_GREEN
Transition: RED → GREEN
Invariant OK ✓
```

### Violation Scenario
```
Applied Rule: RED_TO_YELLOW
Transition: RED → YELLOW
⚠️ INVARIANT VIOLATION: PROPER_SEQUENCE
```

### Deadlock Scenario
```
Applied Rule: RED_TO_GREEN
Transition: RED → GREEN
Invariant OK ✓
No applicable rule found - System halted
```

---

## Testing Scenarios

### Normal Operation - Expected Behavior
- ✓ All transitions succeed
- ✓ Invariants always satisfied
- ✓ Cycles back to RED after YELLOW
- ✓ No violations logged

### Violation Scenario - Expected Behavior
- ✗ Violations detected immediately
- ✗ Wrong sequence detected
- ✗ Log shows violation warnings
- ✓ Model Check shows violations found

### Deadlock Scenario - Expected Behavior
- ✓ First transition (RED→GREEN) succeeds
- ✗ System reaches deadlock
- ✗ No rules applicable from GREEN
- ✓ Log shows "System halted"

---

## Performance Characteristics

- **State Space Size**: 3 states (RED, YELLOW, GREEN)
- **Transition Check**: O(rules.length) per step
- **Invariant Check**: O(invariants.length) per transition
- **Model Check**: O(maxSteps × rules.length) worst case
- **UI Update**: Real-time (~16ms per frame)

---

## Extension Points

To add more demo scenarios:

```typescript
// Add to murphiModel.demoScenarios
race_condition: {
  name: "Race Condition Scenario",
  description: "Two lights can be active simultaneously",
  rules: [/* multi-light rules */],
  invariants: [{
    name: "MUTUAL_EXCLUSION",
    check: (state, lightCount) => lightCount <= 1,
    // This will fail
  }]
}

// Add to DemoMode type
export type DemoMode = "normal" | "violation" | "deadlock" | "race_condition";
```

---

## Browser Compatibility

- Modern browsers with ES6+ support
- React 18+ required
- Framer Motion for animations
- No external Murphi binaries needed (pure TypeScript implementation)

