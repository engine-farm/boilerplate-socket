import * as EngineFarm from "@engine-farm/sdk-types";
import { PlayerEventType } from "../../player-events.game";
import { GameState } from "../game-state";
import { EventsGame } from "../../generated-types";
import { CharacterEntity } from "./character.entity";

export const CharacterActions: EngineFarm.EngineLayer.EngineBuildActionType[] =
  [
    {
      name: "CharacterShooting",
      fn: (
        engineObject: EngineFarm.EngineObject<CharacterEntity["metadata"]>,
        sectorState: GameState,
        objectsRef: EngineFarm.EngineObject[],
        deltaTime: number,
        data: EventsGame.GeneratedEventsBody[EventsGame.GeneratedEventsTypesGame.CharacterShooting]["data"],
        cb: EngineFarm.EngineLayer.EngineActionCallback
      ) => {},
    },
    {
      name: "CharacterChangeDirection",
      fn: (
        engineObject: EngineFarm.EngineObject<CharacterEntity["metadata"]>,
        sectorState: GameState,
        objectsRef: EngineFarm.EngineObject[],
        deltaTime: number,
        data: EventsGame.GeneratedEventsBody[EventsGame.GeneratedEventsTypesGame.CharacterChangeDirection]["data"]
        // cb: EngineLayer.EngineActionCallback
      ) => {
        console.log(
          "[CharacterModule::action::CharacterChangeDirection]",
          data
        );
        if (!data) {
          console.error("no data");
          return;
        }
        const characterEntity = sectorState.characters.get(
          engineObject.elementId as number
        );
        if (characterEntity) {
          engineObject.direction.x = characterEntity.direction.x = data.x;
          engineObject.direction.y = characterEntity.direction.y = data.y;
          engineObject.direction.z = characterEntity.direction.z = data.z;
        }

        console.log(
          "characterEntity.direction",
          characterEntity.direction,
          sectorState.characters.get(engineObject.elementId as number).direction
        );

        return {
          changes: [
            {
              stateKey: "characters",
              element: {
                type: engineObject.type,
                id: engineObject.elementId,
              },
              payload: [
                {
                  path: ["direction", "x"],
                  data: characterEntity.direction.x,
                  type: EngineFarm.DataLayer.UpdateType.SimpleInject,
                },
                {
                  path: ["direction", "y"],
                  data: characterEntity.direction.y,
                  type: EngineFarm.DataLayer.UpdateType.SimpleInject,
                },
                {
                  path: ["direction", "z"],
                  data: characterEntity.direction.z,
                  type: EngineFarm.DataLayer.UpdateType.SimpleInject,
                },
              ],
            },
          ],
        };
      },
    },
    {
      name: "CharacterMovement",
      fn: (
        engineObject: EngineFarm.EngineObject<CharacterEntity["metadata"]>,
        sectorState: GameState,
        objectsRef: EngineFarm.EngineObject[],
        deltaTime: number,
        data: EventsGame.GeneratedEventsBody[EventsGame.GeneratedEventsTypesGame.CharacterMovement]["data"]
        // cb: EngineLayer.EngineActionCallback
      ) => {
        console.log("[CharacterModule::action::CharacterMovement]");
        if (!data) {
          console.error("no data");
          return;
        }
        if (
          data.state === true &&
          data.directions.includes(
            EventsGame.GeneratedEnumCharacterMovementDirections.Forward
          )
        ) {
          const characterEntity = sectorState.characters.get(
            engineObject.elementId as number
          );
          if (characterEntity) {
            // engineObject.direction.multiplyScalar(characterEntity.move.speed * deltaTime)
            engineObject.position.addScaledVector(
              characterEntity.direction,
              characterEntity.move.speed * deltaTime
            );
            // const v = new Vector3().subVectors(engineObject.position, engineObject.direction)

            return {
              changes: [
                {
                  stateKey: "characters",
                  element: {
                    id: engineObject.elementId,
                    type: engineObject.type,
                  },
                  payload: [
                    {
                      path: ["position"],
                      data: {
                        x: engineObject.position.x,
                        y: engineObject.position.y,
                        z: engineObject.position.z,
                      },
                      type: EngineFarm.DataLayer.UpdateType.AssignObject,
                    },
                  ],
                },
              ],
            };
          } else {
            console.error(
              "characterEntity not found",
              engineObject.elementId,
              sectorState.characters
            );
          }
        }
      },
    },
  ];
