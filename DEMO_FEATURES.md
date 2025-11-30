# Murphi Traffic Light Simulator - Demo Features

## Overview
The simulator now includes **three interactive demo scenarios** to showcase Murphi model checking capabilities, including violation detection and deadlock identification.

## Demo Scenarios

### 1. **Normal Operation** ✓
- **Description**: Standard traffic light cycle following proper Murphi rules
- **Rules**:
  - RED → GREEN
  - GREEN → YELLOW
  - YELLOW → RED
- **Invariant**: Only one light can be active at a time
- **Expected Result**: ✓ All invariants hold - No violations detected

**Use Case**: Shows the baseline correct behavior of a traffic light system.

---

### 2. **Violation Scenario** ⚠️
- **Description**: Demonstrates what happens when system rules are broken and invariants are violated
- **Broken Rules**:
  - RED → YELLOW (skips GREEN - **INVALID**)
  - YELLOW → GREEN (wrong sequence - **INVALID**)
  - GREEN → RED (skips YELLOW - **INVALID**)
- **Broken Invariant**: Proper sequence must be maintained (RED → GREEN → YELLOW → RED)
- **Expected Result**: ❌ Invariant violations detected immediately

**Use Case**: Shows your teammates how Murphi detects when traffic light rules are violated, catching bugs in the system logic.

**Key Learning**: When the sequence is not followed, the invariant "PROPER_SEQUENCE" will fail, and the system logs will show:
```
⚠️  INVARIANT VIOLATION: PROPER_SEQUENCE
```

---

### 3. **Deadlock Scenario** 🔒
- **Description**: Demonstrates a system that gets stuck and cannot proceed
- **Rules**:
  - RED → GREEN (works once)
  - GREEN → GREEN (system stuck here - **DEADLOCK**)
- **Broken Invariant**: System must not reach deadlock
- **Expected Result**: System becomes unresponsive after reaching GREEN

**Use Case**: Shows your teammates how Murphi identifies deadlock conditions where the system cannot make progress.

**Key Learning**: The system reaches GREEN, then can only transition to itself, making it impossible to return to RED or proceed to YELLOW. The log will show:
```
No applicable rule found - System halted
```

---

## How to Use

### Running Demo Scenarios

1. **Open the Simulator** in your browser
2. **Select a Demo Scenario** using the buttons in the Control Panel:
   - 🟢 **Normal Operation** - See correct behavior
   - ⚠️ **Violation Scenario** - See invariant violations
   - 🔒 **Deadlock Scenario** - See system getting stuck

3. **Click "Next Step"** to manually step through transitions
4. **Click "Auto Play"** to see the scenario execute automatically
5. **Click "Model Check"** to run a full verification on the scenario

### Understanding the Output

- **Current State**: Shows the traffic light state (RED, YELLOW, or GREEN)
- **Last Rule Applied**: Shows which rule was just executed
- **Invariant Status**: Shows whether invariants are satisfied
  - ✓ **OK** (green) - All invariants satisfied
  - ✗ **VIOLATION DETECTED!** (red) - Invariant broken
- **Log Console**: Detailed trace of all operations

---

## Technical Details

### Model Checking Features

- **State Exploration**: Explores all reachable states from the initial state
- **Invariant Checking**: Validates that system invariants hold at each step
- **Transition Logging**: Records all state transitions and rule applications
- **Violation Detection**: Identifies when invariants are broken
- **Deadlock Detection**: Detects when the system cannot make progress

### Files Modified

- `src/models/murphiModel.ts` - Enhanced with demo scenarios
- `src/components/ControlPanel.tsx` - Added demo scenario selection buttons
- `src/components/MurphiRules.tsx` - Now displays scenario-specific rules
- `src/App.tsx` - Added demo mode management and logging

---

## Educational Value

Use these demo scenarios to explain to your team:

1. **What is Formal Verification?**
   - The Normal Operation scenario shows a correctly functioning system

2. **How do Invariants Work?**
   - The Violation Scenario shows what happens when invariants are broken

3. **What is Deadlock?**
   - The Deadlock Scenario shows how systems can get stuck

4. **Why Use Murphi?**
   - Demonstrates automatic detection of violations and deadlocks that might otherwise go undetected

---

## Tips for Demonstrations

- **Start with Normal Operation** to show baseline behavior
- **Switch to Violation** and press "Auto Play" to see real-time violation detection
- **Watch the Log Console** for detailed messages about what's happening
- **Use "Model Check"** to run full verification and see comprehensive analysis
- **Highlight the color changes** in the Invariant Status indicator for dramatic effect

