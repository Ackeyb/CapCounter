import { CounterValue } from "./counter";

export type Player = CounterValue & {
  name: string;
};

export function createPlayers(names: string[]): Player[] {
  return names.map((name) => ({ name, cap: 0, glass: 0 }));
}

export function updatePlayersFromNames(
  players: Player[],
  names: string[]
): Player[] {
  return names.map((name, index) => {
    const existing = players[index];
    return existing && existing.name === name
      ? existing
      : { name, cap: 0, glass: 0 };
  });
}
