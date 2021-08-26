import { GameState } from "./game-state";
import { FullGameConfig } from "../config";
import { PlayerModule } from "./players/player.module";
import { CharacterModule } from "./character/character.module";
import { PlayerEntity } from "./players/player.entity";
import { CharacterEntity } from "./character/character.entity";

import * as EngineFarm from "@engine-farm/sdk-types";

export const GameModule = new EngineFarm.GameInitInstance(
  "world-1",
  [
    // new PlayerModule(),
    // new CharacterModule()
  ],
  FullGameConfig,
  {
    players: new Map<number, PlayerEntity>(),
    characters: new Map<number, CharacterEntity>(),
  } as GameState
);
