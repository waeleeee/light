export type LightState = "RED" | "YELLOW" | "GREEN";

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

  applyRule: (currentState: LightState): { nextState: LightState; appliedRule: MurphiRule | null } => {
    const applicableRule = murphiModel.rules.find((rule) => rule.guard(currentState));

    if (applicableRule) {
      const nextState = applicableRule.action(currentState);
      return { nextState, appliedRule: applicableRule };
    }

    return { nextState: currentState, appliedRule: null };
  },

  checkInvariant: (state: LightState): { valid: boolean; violations: string[] } => {
    const violations: string[] = [];
    const activeCount = 1;

    for (const invariant of murphiModel.invariants) {
      if (!invariant.check(state, activeCount)) {
        violations.push(invariant.name);
      }
    }

    return {
      valid: violations.length === 0,
      violations,
    };
  },

  runModelCheck: (): {
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

    visitedStates.push(currentState);

    for (let step = 0; step < maxSteps; step++) {
      const { nextState, appliedRule } = murphiModel.applyRule(currentState);

      if (!appliedRule) break;

      const invariantCheck = murphiModel.checkInvariant(nextState);

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
