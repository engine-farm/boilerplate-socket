import { EventsGame } from "../../../generated-types";
import { DataLayer, EngineLayer } from "@engine-farm/sdk-types";
import { GameState } from "../../game-state";
import { CharacterEntity } from "../character.entity";

type CharacterMovementData =
  EventsGame.GeneratedEventsBody[EventsGame.GeneratedEventsTypesGame.CharacterMovement]["data"];

export class CharacterMovementAction
  implements
    EngineLayer.IAction<GameState, CharacterEntity, CharacterMovementData>
{
  name = "CharacterMovement";

  onAction({
    objectsRef,
    engineObject,
    sectorState,
    data,
    deltaTime,
  }: EngineLayer.IActionPayload<
    GameState,
    CharacterEntity,
    CharacterMovementData
  >): EngineLayer.EngineActionReturnType {
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
        engineObject.elementId as string
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
                  type: DataLayer.UpdateType.AssignObject,
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
  }
}
