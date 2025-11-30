export type LightState = "RED" | "YELLOW" | "GREEN";
export type DemoMode = "normal" | "violation" | "deadlock";

export interface MurphiRule {
  id: string;
  name: string;
  guard: (state: LightState) => boolean;
  action: (state: LightState) => LightState;
  description: string;
}

export interface MurphiInvariant {
  id: string;
  name: string;
  check: (state: LightState, activeCount: number) => boolean;
  description: string;
}

export interface TransitionLog {
  timestamp: number;
  fromState: LightState;
  toState: LightState;
  rule: string;
  invariantStatus: "OK" | "VIOLATION";
}

export interface DemoScenario {
  name: string;
  description: string;
  rules: MurphiRule[];
  invariants: MurphiInvariant[];
}

export const murphiModel = {
  states: ["RED", "YELLOW", "GREEN"] as LightState[],

  rules: [
    {
      id: "rule1",
      name: "RED_TO_GREEN",
      guard: (state: LightState) => state === "RED",
      action: () => "GREEN" as LightState,
      description: "ruleset RED_TO_GREEN\n  state = RED =>\n    state := GREEN;\nend;",
    },
    {
      id: "rule2",
      name: "GREEN_TO_YELLOW",
      guard: (state: LightState) => state === "GREEN",
      action: () => "YELLOW" as LightState,
      description: "ruleset GREEN_TO_YELLOW\n  state = GREEN =>\n    state := YELLOW;\nend;",
    },
    {
      id: "rule3",
      name: "YELLOW_TO_RED",
      guard: (state: LightState) => state === "YELLOW",
      action: () => "RED" as LightState,
      description: "ruleset YELLOW_TO_RED\n  state = YELLOW =>\n    state := RED;\nend;",
    },
  ] as MurphiRule[],

  invariants: [
    {
      id: "inv1",
      name: "SINGLE_LIGHT_ACTIVE",
      check: (state: LightState, activeCount: number) => {
        return activeCount === 1;
      },
      description: "invariant \"Only one light can be active\"\n  activeCount = 1;",
    },
  ] as MurphiInvariant[],

  // Demo Scenarios
  demoScenarios: {
    normal: {
      name: "Normal Operation",
      description: "Standard traffic light cycle following proper rules",
      rules: [
        {
          id: "rule1",
          name: "RED_TO_GREEN",
          guard: (state: LightState) => state === "RED",
          action: () => "GREEN" as LightState,
          description: "ruleset RED_TO_GREEN\n  state = RED =>\n    state := GREEN;\nend;",
        },
        {
          id: "rule2",
          name: "GREEN_TO_YELLOW",
          guard: (state: LightState) => state === "GREEN",
          action: () => "YELLOW" as LightState,
          description: "ruleset GREEN_TO_YELLOW\n  state = GREEN =>\n    state := YELLOW;\nend;",
        },
        {
          id: "rule3",
          name: "YELLOW_TO_RED",
          guard: (state: LightState) => state === "YELLOW",
          action: () => "RED" as LightState,
          description: "ruleset YELLOW_TO_RED\n  state = YELLOW =>\n    state := RED;\nend;",
        },
      ],
      invariants: [
        {
          id: "inv1",
          name: "SINGLE_LIGHT_ACTIVE",
          check: (state: LightState, activeCount: number) => activeCount === 1,
          description: "invariant \"Only one light can be active\"\n  activeCount = 1;",
        },
      ],
    },
    violation: {
      name: "Violation Scenario",
      description: "Shows what happens when invariants are violated",
      rules: [
        {
          id: "rule1",
          name: "RED_TO_YELLOW",
          guard: (state: LightState) => state === "RED",
          action: () => "YELLOW" as LightState,
          description: "ruleset RED_TO_YELLOW (INVALID)\n  state = RED =>\n    state := YELLOW;  -- Skips GREEN!\nend;",
        },
        {
          id: "rule2",
          name: "YELLOW_TO_GREEN",
          guard: (state: LightState) => state === "YELLOW",
          action: () => "GREEN" as LightState,
          description: "ruleset YELLOW_TO_GREEN (INVALID)\n  state = YELLOW =>\n    state := GREEN;  -- Wrong order!\nend;",
        },
        {
          id: "rule3",
          name: "GREEN_TO_RED",
          guard: (state: LightState) => state === "GREEN",
          action: () => "RED" as LightState,
          description: "ruleset GREEN_TO_RED (INVALID)\n  state = GREEN =>\n    state := RED;  -- Skips YELLOW!\nend;",
        },
      ],
      invariants: [
        {
          id: "inv1",
          name: "PROPER_SEQUENCE",
          check: (state: LightState) => {
            // This will fail with the violation rules
            return false; // Force violation to show
          },
          description: "invariant \"Proper traffic light sequence must be maintained\"\n  Sequence: RED -> GREEN -> YELLOW -> RED;",
        },
      ],
    },
    deadlock: {
      name: "Deadlock Scenario",
      description: "Shows a system that gets stuck and cannot proceed",
      rules: [
        {
          id: "rule1",
          name: "RED_TO_GREEN",
          guard: (state: LightState) => state === "RED",
          action: () => "GREEN" as LightState,
          description: "ruleset RED_TO_GREEN\n  state = RED =>\n    state := GREEN;\nend;",
        },
        {
          id: "rule_stuck",
          name: "STUCK_IN_GREEN",
          guard: (state: LightState) => state === "GREEN",
          action: () => "GREEN" as LightState,
          description: "ruleset STUCK_IN_GREEN (DEADLOCK)\n  state = GREEN =>\n    state := GREEN;  -- System stuck!\nend;",
        },
      ],
      invariants: [
        {
          id: "inv1",
          name: "NO_DEADLOCK",
          check: (state: LightState, activeCount: number, stepCount?: number) => {
            // After 2 steps, if still in GREEN, deadlock detected
            return !(stepCount && stepCount > 1 && state === "GREEN");
          },
          description: "invariant \"System must not reach deadlock\"\n  System must always be able to transition;",
        },
      ],
    },
  } as Record<DemoMode, DemoScenario>,

  applyRule: (currentState: LightState, rules?: MurphiRule[]): { nextState: LightState; appliedRule: MurphiRule | null } => {
    const rulesToUse = rules || murphiModel.rules;
    const applicableRule = rulesToUse.find((rule) => rule.guard(currentState));

    if (applicableRule) {
      const nextState = applicableRule.action(currentState);
      return { nextState, appliedRule: applicableRule };
    }

    return { nextState: currentState, appliedRule: null };
  },

  checkInvariant: (state: LightState, invariants?: MurphiInvariant[], stepCount?: number): { valid: boolean; violations: string[] } => {
    const violations: string[] = [];
    const activeCount = 1;
    const invariantsToCheck = invariants || murphiModel.invariants;

    for (const invariant of invariantsToCheck) {
      if (!invariant.check(state, activeCount, stepCount)) {
        violations.push(invariant.name);
      }
    }

    return {
      valid: violations.length === 0,
      violations,
    };
  },

  runModelCheck: (scenario?: DemoScenario): {
    visitedStates: LightState[];
    transitions: TransitionLog[];
    violations: string[];
    complete: boolean;
  } => {
    const visitedStates: LightState[] = [];
    const transitions: TransitionLog[] = [];
    const violations: string[] = [];
    let currentState: LightState = "RED";
    const maxSteps = 10;
    
    const rulesToUse = scenario?.rules || murphiModel.rules;
    const invariantsToCheck = scenario?.invariants || murphiModel.invariants;

    visitedStates.push(currentState);

    for (let step = 0; step < maxSteps; step++) {
      const { nextState, appliedRule } = murphiModel.applyRule(currentState, rulesToUse);

      if (!appliedRule) break;

      const invariantCheck = murphiModel.checkInvariant(nextState, invariantsToCheck, step + 1);

      transitions.push({
        timestamp: Date.now() + step,
        fromState: currentState,
        toState: nextState,
        rule: appliedRule.name,
        invariantStatus: invariantCheck.valid ? "OK" : "VIOLATION",
      });

      if (!invariantCheck.valid) {
        violations.push(...invariantCheck.violations);
      }

      visitedStates.push(nextState);
      currentState = nextState;
    }

    return {
      visitedStates,
      transitions,
      violations,
      complete: true,
    };
  },
};
