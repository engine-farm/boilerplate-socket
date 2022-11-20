import { GameState, GameStateNamespace } from "./game-state";
import { PlayerEntity } from "./players/player.entity";
import { CharacterEntity } from "./character/character.entity";

import * as EngineFarm from "@engine-farm/sdk-types";
import { Config } from "@engine-farm/sdk-types";

const gameState = {
  [GameStateNamespace.Players]: new EngineFarm.DataLayer.StateMap<
    PlayerEntity,
    string
  >(GameStateNamespace.Players, {
    syncLayers: [
      [EngineFarm.InstanceTypes.World, "*"],
      [EngineFarm.InstanceTypes.Sector, "*"],
    ],
    entity: PlayerEntity,
    events: {
      engine: {
        // creating new EngineObject instance in sector
        onSet: (newEngineObject, data) => {
          // on return required elementId and createObject where createObject is an newEngineObject and can be modified
          return {
            elementId: data.userId,
            createObject: newEngineObject,
          };
        },
        onDelete: (elementId, existsObject) => {
          let removeId = existsObject?.elementId as string;

          return {
            elementId: removeId, // element
            remove: !!removeId, // you can leave removing action in engine if this element will be created back soon in sector
          };
        },
      },
    },
  }),
  [GameStateNamespace.Characters]: new EngineFarm.DataLayer.StateMap<
    CharacterEntity,
    string
  >(GameStateNamespace.Characters, {
    syncLayers: [
      [EngineFarm.InstanceTypes.World, "*"],
      [EngineFarm.InstanceTypes.Sector, "*"],
    ],
    entity: CharacterEntity,
    events: {
      engine: {
        onSet: (newEngineObject, data) => {
          console.log("character set", data);
          // modify new instance of EngineObject and return data to creating object in engine
          newEngineObject.position.set(
            data.position.x,
            data.position.y,
            data.position.z
          );
          return {
            elementId: data.characterId,
            createObject: newEngineObject,
          };
        },
        onDelete: (elementId, existsObject) => {
          let removeId = existsObject?.elementId as string;

          return {
            elementId: removeId, // element
            remove: !!removeId, // you can leave removing action in engine if this element will be created back soon in sector
          };
        },
      },
    },
  }),
} as GameState;

globalThis.GameState = gameState;

const config = Config.getConfig();
console.log("game module config", config);

export const GameModule = new EngineFarm.GameInitInstance(
  "world-1",
  [],
  config,
  gameState
);
