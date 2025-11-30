# Quick Start Guide - Demo Scenarios

## 🎯 Quick Demo for Your Team

### **30-Second Demo**
1. Open the simulator
2. Click **"Violation Scenario"**
3. Click **"Auto Play"**
4. Watch as the red "VIOLATION DETECTED!" message appears
5. Show your teammates the Log Console with violation messages

### **5-Minute Demo**

#### Part 1: Normal Operation (1 min)
```
Click: Normal Operation
Click: Auto Play
Show: Traffic light cycles through RED → GREEN → YELLOW → RED
Point out: Invariant Status stays GREEN (OK)
```

#### Part 2: Violation Scenario (2 min)
```
Click: Reset
Click: Violation Scenario
Click: Auto Play
Point out: Rules now skip the proper sequence
Watch: Invariant Status turns RED (VIOLATION)
Show: Log messages with ⚠️ INVARIANT VIOLATION
```

#### Part 3: Deadlock Scenario (2 min)
```
Click: Reset
Click: Deadlock Scenario
Click: Auto Play
Show: System gets stuck in GREEN state
Point out: "No applicable rule found - System halted"
Explain: This is a deadlock - system cannot progress
```

---

## 📊 What Each Scenario Demonstrates

| Scenario | Rule Issue | Result | Why It Matters |
|----------|-----------|--------|---|
| **Normal** | None | ✓ Safe cycling | Shows correct behavior baseline |
| **Violation** | Invalid sequence (RED→YELLOW) | ✗ Rules broken | Shows Murphi catches logic errors |
| **Deadlock** | Self-loop in GREEN | 🔒 System stuck | Shows Murphi catches unresponsiveness |

---

## 💡 Key Messages for Your Team

### 1. "Formal Verification Catches Bugs"
- **Point to**: Normal Operation vs Violation Scenario
- **Show**: How invariants automatically detect the difference

### 2. "Murphi is Exhaustive"
- **Point to**: Model Check button results
- **Show**: Number of states and transitions explored

### 3. "Real-World Importance"
- **Connect to**: Safety-critical systems (traffic lights, medical devices)
- **Explain**: A wrong state sequence or deadlock could be catastrophic

---

## 🎓 Educational Talking Points

### For Developers:
"This shows how formal verification can catch bugs that code reviews and testing might miss. Notice how the Violation Scenario doesn't just fail—Murphi tells us exactly which invariant was violated."

### For Project Managers:
"Using formal verification tools like Murphi can catch critical bugs early, reducing expensive post-deployment fixes and recalls."

### For Students:
"This is real-world model checking in action. These techniques are used in industries where failures are not acceptable: aerospace, medical devices, banking systems."

---

## 🔍 What to Look For When Running Demos

### ✓ Normal Operation
- Light cycles properly: RED → GREEN → YELLOW → RED
- Invariant Status stays green with "OK" message
- Log shows "Invariant OK ✓" after each transition

### ⚠️ Violation Scenario  
- Sequence breaks: RED → YELLOW (skips GREEN)
- Watch Invariant Status turn red immediately
- Log fills with ⚠️ warning messages
- Model Check shows violations found

### 🔒 Deadlock Scenario
- System reaches GREEN
- Then only transitions to itself
- Log shows "No applicable rule found"
- Watch it get stuck and unable to continue

---

## 📈 Advanced Features

### Model Check Button
Click to see:
- Total states visited
- Total transitions executed
- Violations found (0 for Normal, 3+ for others)
- Summary of all violations

### Auto Play
- Automatically steps through scenario
- 1.5 seconds per transition (good for presentations)
- Stop button to pause anytime

### Next Step
- Manual control for step-by-step explanation
- Good for detailed code walkthroughs

---

## 🎬 Suggested Demo Script

**Intro (30 seconds):**
"I want to show you something powerful—a formal verification tool that automatically detects bugs in system design. This is called Murphi, and it works by checking that system rules follow mathematical invariants."

**Demo Normal (1 minute):**
"First, here's what a correct traffic light system looks like. It cycles through states properly, and you can see the invariant check always passes—everything is OK."

**Switch to Violation (1 minute):**
"Now, what if someone writes buggy rules? What if instead of RED going to GREEN, it goes straight to YELLOW? The system starts running, and almost immediately—Murphi detects a violation. It tells us exactly what's wrong."

**Switch to Deadlock (1 minute):**
"Here's another problem: what if the system gets stuck? In real-world scenarios like traffic control, being stuck is a disaster. Murphi can find these deadlocks automatically. See how it reaches GREEN and then can't go anywhere?"

**Conclusion (30 seconds):**
"This is why formal verification matters. These bugs might be hard to find in testing, but Murphi finds them automatically and exhaustively. That's the power of model checking."

---

## 🚀 Next Steps After Demo

- **Ask questions**: "Can you spot what's wrong with the Violation rules?"
- **Let them try**: "Try clicking Next Step to see it slow-motion"
- **Make it relatable**: "Imagine this is your medical device—would you want to catch these bugs before deployment?"
- **Link to theory**: Show the corresponding Murphi pseudocode for each scenario

