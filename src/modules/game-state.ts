import * as EngineFarm from "@engine-farm/sdk-types";
import { CharacterEntity } from "./character/character.entity";
import { PlayerEntity } from "./players/player.entity";

export enum GameStateNamespace {
  Players = "players",
  Characters = "characters",
}

export type GameState = EngineFarm.ServerState & {
  [GameStateNamespace.Players]: EngineFarm.DataLayer.StateMap<
    PlayerEntity,
    string
  >;
  [GameStateNamespace.Characters]: EngineFarm.DataLayer.StateMap<
    CharacterEntity,
    string
  >;
};
