import { Fighter } from './wikipediaService';

export interface BattleLogEntry {
  id: string;
  attackerIdx: number;
  defenderIdx: number;
  damage: number;
  isCrit: boolean;
  evaded: boolean;
  timestamp: number;
}

export interface BattleState {
  fighters: Fighter[];
  hps: number[];
  logs: BattleLogEntry[];
  winnerIdx: number | null;
  isFinished: boolean;
}

export function executeTurn(state: BattleState, attackerIdx: number, defenderIdx: number): BattleState {
  if (state.isFinished) return state;

  const fAtk = state.fighters[attackerIdx];
  const fDef = state.fighters[defenderIdx];

  const evaded = Math.random() * 100 < fDef.eva;
  if (evaded) {
    const newLog = {
      id: Math.random().toString(36).substring(7),
      attackerIdx,
      defenderIdx,
      damage: 0,
      isCrit: false,
      evaded: true,
      timestamp: Date.now()
    };
    return {
      ...state,
      logs: [...state.logs, newLog]
    };
  }

  const range = fAtk.atk * 0.25;
  const baseDmg = fAtk.atk + (Math.random() * range * 2 - range);
  const isCrit = Math.random() * 100 < fAtk.crit;
  const finalDmg = Math.max(10, baseDmg * (1 - fDef.arm / 100)) * (isCrit ? 2 : 1);

  const newHps = [...state.hps];
  newHps[defenderIdx] = Math.max(0, newHps[defenderIdx] - finalDmg);

  const newLog = {
    id: Math.random().toString(36).substring(7),
    attackerIdx,
    defenderIdx,
    damage: finalDmg,
    isCrit,
    evaded: false,
    timestamp: Date.now()
  };

  const isFinished = newHps[0] <= 0 || newHps[1] <= 0;
  let winnerIdx = null;
  if (isFinished) {
    if (newHps[0] <= 0 && newHps[1] > 0) winnerIdx = 1;
    else if (newHps[1] <= 0 && newHps[0] > 0) winnerIdx = 0;
    else winnerIdx = newHps[0] > newHps[1] ? 0 : 1; // Tiebreaker
  }

  return {
    ...state,
    hps: newHps,
    logs: [...state.logs, newLog],
    isFinished,
    winnerIdx
  };
}

export function simulateBattle(fighters: Fighter[]): BattleState {
  let state: BattleState = {
    fighters,
    hps: [fighters[0].hp, fighters[1].hp],
    logs: [],
    winnerIdx: null,
    isFinished: false
  };

  const spdAcc = [0, 0];
  let safetyCounter = 0;

  while (!state.isFinished && safetyCounter < 1000) {
    safetyCounter++;
    spdAcc[0] += state.fighters[0].spd;
    spdAcc[1] += state.fighters[1].spd;

    if (spdAcc[0] >= 2) {
      state = executeTurn(state, 0, 1);
      spdAcc[0] -= 2;
    }
    if (!state.isFinished && spdAcc[1] >= 2) {
      state = executeTurn(state, 1, 0);
      spdAcc[1] -= 2;
    }
  }

  // Fallback in case endless loop
  if (!state.isFinished) {
    state.isFinished = true;
    state.winnerIdx = state.hps[0] > state.hps[1] ? 0 : 1;
  }

  return state;
}
