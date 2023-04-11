import { EventsGame } from "../../../generated-types";
import { DataLayer, EngineLayer, Euler, Vector3 } from "@engine-farm/sdk-types";
import { GameState } from "../../game-state";
import { CharacterEntity } from "../character.entity";

type CharacterMovementData =
  EventsGame.GeneratedEventsBody[EventsGame.GeneratedEventsTypesGame.CharacterMovement]["data"];

type MovementDirection = EventsGame.GeneratedEnumCharacterMovementDirections;

export class CharacterMovementAction
  implements
    EngineLayer.IAction<GameState, CharacterEntity, CharacterMovementData>
{
  name = "CharacterMovement";

  onAction({
    objectsHelper,
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
    if (data.state === true && data.directions.length) {
      const characterEntity = sectorState.characters.get(
        engineObject.elementId as string
      );
      if (characterEntity) {
        // engineObject.direction.multiplyScalar(characterEntity.move.speed * deltaTime)

        const oldPosition = characterEntity.position;

        const newPosition = this.calculateNewPosition(
          engineObject.position,
          data.directions,
          engineObject.rotation,
          deltaTime,
          characterEntity.move.speed
        );

        // const newPosition = engineObject.position.addScaledVector(
        //   characterEntity.direction,
        //   characterEntity.move.speed * deltaTime
        // );
        console.log("characterEntity move action", oldPosition, newPosition);
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
                    x: newPosition.newPosition.x,
                    y: newPosition.newPosition.y,
                    z: newPosition.newPosition.z,
                  },
                  type: DataLayer.UpdateType.AssignObject,
                },
                {
                  path: ["direction"],
                  dataBeforeChange: newPosition.direction,
                  data: {
                    x: newPosition.direction.x,
                    y: newPosition.direction.y,
                    z: newPosition.direction.z,
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

  private calculateNewPosition(
    currentPosition: Vector3,
    directions: EventsGame.GeneratedEnumCharacterMovementDirections[],
    rotation: Euler,
    deltaTime: number,
    speed: number
  ) {
    const directionVector = new Vector3();
    if (
      directions.includes(
        EventsGame.GeneratedEnumCharacterMovementDirections.Forward
      )
    ) {
      directionVector.z -= 1;
    }
    if (
      directions.includes(
        EventsGame.GeneratedEnumCharacterMovementDirections.Backward
      )
    ) {
      directionVector.z += 1;
    }
    if (
      directions.includes(
        EventsGame.GeneratedEnumCharacterMovementDirections.Left
      )
    ) {
      directionVector.x -= 1;
    }
    if (
      directions.includes(
        EventsGame.GeneratedEnumCharacterMovementDirections.Right
      )
    ) {
      directionVector.x += 1;
    }
    if (
      directions.includes(
        EventsGame.GeneratedEnumCharacterMovementDirections.Up
      )
    ) {
      directionVector.y += 1;
    }
    if (
      directions.includes(
        EventsGame.GeneratedEnumCharacterMovementDirections.Down
      )
    ) {
      directionVector.y -= 1;
    }

    const movementVector = directionVector
      .applyEuler(rotation)
      .multiplyScalar(speed * deltaTime);
    const newPosition = currentPosition.add(movementVector);

    let jumpStartTime = 0;
    let isJumping = false;
    if (
      directions.includes(
        EventsGame.GeneratedEnumCharacterMovementDirections.Jump
      )
    ) {
      const jumpDuration = 0.5; // czas trwania skoku w sekundach
      jumpStartTime = new Date().getTime();
      isJumping = true;

      const jumpHeight = 2; // wysokość skoku w jednostkach
      const jumpVelocity = Math.sqrt(2 * jumpHeight * 9.81); // prędkość początkowa w pionie

      // Przemieszczenie w osi pionowej zgodnie z krzywą kwadratową
      const jumpDistance = jumpVelocity * jumpDuration; // przemieszczenie w osi pionowej
      const jumpHeightCoef = jumpHeight / Math.pow(jumpDistance / 2, 2);
      const jumpTimeCoef = jumpDuration / (jumpDistance / 2);

      const timePassed = (new Date().getTime() - jumpStartTime) / 1000;
      if (timePassed <= jumpDuration) {
        const jumpHeight =
          jumpHeightCoef *
          Math.pow(timePassed - jumpTimeCoef * (jumpDistance / 2), 2);
        newPosition.y = jumpHeight;
      } else {
        newPosition.y = currentPosition.y;
        isJumping = false;
      }
    }

    return {
      newPosition,
      jumpStartTime,
      isJumping,
      direction: directionVector,
    };
  }
}
