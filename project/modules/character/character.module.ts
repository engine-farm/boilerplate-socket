import * as EngineFarm from "@engine-farm/sdk-types";
import { CharacterController } from "./character.controller";
// import { CharacterUpdateServer } from './character-update.server';
// import { CharacterUpdateNetwork } from './character-update.network';
import { CharacterEntity } from "./character.entity";
import { PlayerEventType } from "../../player-events.game";
import { GameState } from "../game-state";
import { EventsGame } from "../../generated-types";

@EngineFarm.GBModule({
  controllers: [CharacterController],
  entity: CharacterEntity,
  events: [
    {
      name: "CharacterMovement",
      type: PlayerEventType.CharacterMovement,
      data: {
        state: EngineFarm.EndpointLayer.PlayerEventDataKeyTypes.Boolean,
        directions: [
          EngineFarm.EndpointLayer.PlayerEventDataKeyTypes.Enum,
          "Directions",
          EngineFarm.EndpointLayer.PlayerEventDataFormat.MultiValues,
        ],
      },
      enums: {
        Directions: ["Forward", "Backward", "Left", "Right", "Up", "Down"],
      },
    },
    {
      name: "CharacterRotation",
      type: PlayerEventType.CharacterRotation,
      data: {
        x: EngineFarm.EndpointLayer.PlayerEventDataKeyTypes.Number,
        y: EngineFarm.EndpointLayer.PlayerEventDataKeyTypes.Number,
        z: EngineFarm.EndpointLayer.PlayerEventDataKeyTypes.Number,
      },
    },
    {
      name: "CharacterChangeDirection",
      type: PlayerEventType.CharacterChangeDirection,
      data: {
        x: EngineFarm.EndpointLayer.PlayerEventDataKeyTypes.Number,
        y: EngineFarm.EndpointLayer.PlayerEventDataKeyTypes.Number,
        z: EngineFarm.EndpointLayer.PlayerEventDataKeyTypes.Number,
      },
    },
    {
      name: "CharacterShooting",
      type: PlayerEventType.CharacterShooting,
      data: {
        weaponIndex: EngineFarm.EndpointLayer.PlayerEventDataKeyTypes.Number,
      },
    },
  ],
  update: {
    inServer: null, //CharacterUpdateServer,
    inNetwork: null, // CharacterUpdateNetwork,
  },
  microFunctions: [
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
  ],
  /**
   * Detect collisions for this engine objects (entity = type).
   * Callback should send events to longLogic or microAction. When
   * @param objects
   * @param cb
   */
  // onColliding: (objects: EngineObject[], cb: () => void) => {},
})
export class CharacterModule {}
