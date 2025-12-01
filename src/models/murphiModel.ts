export type LightState = "RED" | "YELLOW" | "GREEN";
export type DemoMode = "normal" | "violation" | "deadlock";

export interface MurphiRule {
  id: string;
  name: string;
  guard: (state: LightState, prevState?: LightState, step?: number) => boolean;
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
      guard: (state: LightState, prevState?: LightState) => state === "RED",
      action: () => "GREEN" as LightState,
      description: "ruleset RED_TO_GREEN\n  état = RED =>\n    état := GREEN;\nend;",
    },
    {
      id: "rule2",
      name: "GREEN_TO_YELLOW",
      guard: (state: LightState, prevState?: LightState) => state === "GREEN",
      action: () => "YELLOW" as LightState,
      description: "ruleset GREEN_TO_YELLOW\n  état = GREEN =>\n    état := YELLOW;\nend;",
    },
    {
      id: "rule3",
      name: "YELLOW_TO_RED",
      guard: (state: LightState, prevState?: LightState) => state === "YELLOW",
      action: () => "RED" as LightState,
      description: "ruleset YELLOW_TO_RED\n  état = YELLOW =>\n    état := RED;\nend;",
    },
  ] as MurphiRule[],

  invariants: [
    {
      id: "inv1",
      name: "SINGLE_LIGHT_ACTIVE",
      check: (state: LightState, activeCount: number) => {
        return activeCount === 1;
      },
      description: "invariant \"Un seul feu peut être actif\"\n  activeCount = 1;",
    },
  ] as MurphiInvariant[],

  // Scénarios de démonstration
  demoScenarios: {
    normal: {
      name: "Fonctionnement Normal",
      description: "Cycle standard du feu tricolore",
      rules: [
        {
          id: "RED_TO_YELLOW",
          name: "RED_TO_YELLOW",
          guard: (state: LightState, prevState?: LightState) => state === "RED",
          action: () => "YELLOW" as LightState,
          description: "ruleset RED_TO_YELLOW\n  state = RED =>\n    state := YELLOW;\nend;",
        },
        {
          id: "YELLOW_TO_GREEN",
          name: "YELLOW_TO_GREEN",
          guard: (state: LightState, prevState?: LightState) => state === "YELLOW" && prevState === "RED",
          action: () => "GREEN" as LightState,
          description: "ruleset YELLOW_TO_GREEN\n  state = YELLOW and prev = RED =>\n    state := GREEN;\nend;",
        },
        {
          id: "GREEN_TO_YELLOW",
          name: "GREEN_TO_YELLOW",
          guard: (state: LightState, prevState?: LightState) => state === "GREEN",
          action: () => "YELLOW" as LightState,
          description: "ruleset GREEN_TO_YELLOW\n  state = GREEN =>\n    state := YELLOW;\nend;",
        },
        {
          id: "YELLOW_TO_RED",
          name: "YELLOW_TO_RED",
          guard: (state: LightState, prevState?: LightState) => state === "YELLOW" && prevState === "GREEN",
          action: () => "RED" as LightState,
          description: "ruleset YELLOW_TO_RED\n  state = YELLOW and prev = GREEN =>\n    state := RED;\nend;",
        },
      ],
      invariants: [
        {
          id: "inv1",
          name: "SINGLE_LIGHT_ACTIVE",
          check: (state: LightState, activeCount: number) => activeCount === 1,
          description: "invariant \"Un seul feu peut être actif\"\n  activeCount = 1;",
        },
      ],
    },
    violation: {
      name: "Scénario de violation",
      description: "Montre ce qui se passe lorsque les invariants sont violés",
      rules: [
        {
          id: "rule1",
          name: "RED_TO_YELLOW",
          guard: (state: LightState, prevState?: LightState) => state === "RED",
          action: () => "YELLOW" as LightState,
          description: "ruleset RED_TO_YELLOW (INVALID)\n  état = RED =>\n    état := YELLOW;  -- Passe à GREEN !\nend;",
        },
        {
          id: "rule2",
          name: "YELLOW_TO_GREEN",
          guard: (state: LightState, prevState?: LightState) => state === "YELLOW",
          action: () => "GREEN" as LightState,
          description: "ruleset YELLOW_TO_GREEN (INVALID)\n  état = YELLOW =>\n    état := GREEN;  -- Ordre incorrect !\nend;",
        },
        {
          id: "rule3",
          name: "GREEN_TO_RED",
          guard: (state: LightState, prevState?: LightState) => state === "GREEN",
          action: () => "RED" as LightState,
          description: "ruleset GREEN_TO_RED (INVALID)\n  état = GREEN =>\n    état := RED;  -- Passe YELLOW !\nend;",
        },
      ],
      invariants: [
        {
          id: "inv1",
          name: "PROPER_SEQUENCE",
          check: (state: LightState) => {
            // Ceci échouera avec les règles de violation
            return false; // Forcer une violation pour la démonstration
          },
          description: "invariant \"La séquence du feu tricolore doit être respectée\"\n  Séquence : RED -> GREEN -> YELLOW -> RED;",
        },
      ],
    },
    deadlock: {
      name: "Scénario d'interblocage",
      description: "Montre un système qui se bloque et ne peut plus progresser",
      rules: [
        {
          id: "rule1",
          name: "RED_TO_GREEN",
          guard: (state: LightState, prevState?: LightState) => state === "RED",
          action: () => "GREEN" as LightState,
          description: "ruleset RED_TO_GREEN\n  état = RED =>\n    état := GREEN;\nend;",
        },
        {
          id: "rule_stuck",
          name: "STUCK_IN_GREEN",
          guard: (state: LightState, prevState?: LightState) => state === "GREEN",
          action: () => "GREEN" as LightState,
          description: "ruleset STUCK_IN_GREEN (DEADLOCK)\n  état = GREEN =>\n    état := GREEN;  -- Système bloqué !\nend;",
        },
      ],
      invariants: [
        {
          id: "inv1",
          name: "NO_DEADLOCK",
          check: (state: LightState, activeCount: number, stepCount?: number) => {
            // Après 2 étapes, si toujours en GREEN, interblocage détecté
            return !(stepCount && stepCount > 1 && state === "GREEN");
          },
          description: "invariant \"Le système ne doit pas atteindre l'interblocage\"\n  Le système doit toujours pouvoir effectuer une transition;",
        },
      ],
    },
  } as Record<DemoMode, DemoScenario>,

  applyRule: (currentState: LightState, rules?: MurphiRule[], prevState?: LightState, step?: number): { nextState: LightState; appliedRule: MurphiRule | null } => {
    const rulesToUse = rules || murphiModel.rules;
    const applicableRule = rulesToUse.find((rule) => rule.guard(currentState, prevState, step));

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

    let prevState: LightState | undefined = undefined;

    for (let step = 0; step < maxSteps; step++) {
      const { nextState, appliedRule } = murphiModel.applyRule(currentState, rulesToUse, prevState, step + 1);

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
      prevState = currentState;
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
