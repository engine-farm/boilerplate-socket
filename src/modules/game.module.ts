import { GameState } from "./game-state";
import { FullGameConfig } from "../config";
import { PlayerModule } from "./players/player.module";
import { CharacterModule } from "./character/character.module";
import { PlayerEntity } from "./players/player.entity";
import { CharacterEntity } from "./character/character.entity";

import * as EngineFarm from "@engine-farm/sdk-types";

const gameState = {
  players: new EngineFarm.DataLayer.StateMap<PlayerEntity, number>("players", {
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
          let removeId = existsObject?.elementId as number;

          return {
            elementId: removeId, // element
            remove: !!removeId, // you can leave removing action in engine if this element will be created back soon in sector
          };
        },
      },
    },
  }),
  characters: new EngineFarm.DataLayer.StateMap<CharacterEntity, number>(
    "characters",
    {
      syncLayers: [
        [EngineFarm.InstanceTypes.World, "*"],
        [EngineFarm.InstanceTypes.Sector, "*"],
      ],
      entity: CharacterEntity,
      events: {
        engine: {
          onSet: (newEngineObject, data) => {
            console.log('character set', data);
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
            let removeId = existsObject?.elementId as number;

            return {
              elementId: removeId, // element
              remove: !!removeId, // you can leave removing action in engine if this element will be created back soon in sector
            };
          },
        },
      },
    }
  ),
} as GameState;

globalThis.GameState = gameState;

export const GameModule = new EngineFarm.GameInitInstance(
  "world-1",
  [],
  FullGameConfig,
  gameState
);

