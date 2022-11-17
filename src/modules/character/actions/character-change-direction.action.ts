import { DataLayer, EngineLayer } from '@engine-farm/sdk-types';
import { CharacterEntity } from "../character.entity";
import { EventsGame } from "../../../generated-types";
import { GameState } from '../../game-state';

type CharacterChangeDirectionData =
  EventsGame.GeneratedEventsBody[EventsGame.GeneratedEventsTypesGame.CharacterChangeDirection]["data"];

export class CharacterChangeDirectionAction
  implements EngineLayer.IAction<GameState, CharacterEntity, CharacterChangeDirectionData>
{
  name = "CharacterChangeDirection";

  onAction({
    engineObject,
    objectsRef,
    sectorState,
    data,
    deltaTime,
  }: EngineLayer.IActionPayload<GameState, CharacterEntity, CharacterChangeDirectionData>): EngineLayer.EngineActionReturnType {
    console.log("[CharacterModule::action::CharacterChangeDirection]", data);
    if (!data) {
      console.error("no data");
      return;
    }
    const characterEntity = sectorState.characters.get(
      engineObject.elementId as string
    );
    if (characterEntity) {
      engineObject.direction.x = characterEntity.direction.x = data.x;
      engineObject.direction.y = characterEntity.direction.y = data.y;
      engineObject.direction.z = characterEntity.direction.z = data.z;
    }

    console.log(
      "characterEntity.direction",
      characterEntity.direction,
      sectorState.characters.get(engineObject.elementId as string).direction
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
              type: DataLayer.UpdateType.SimpleInject,
            },
            {
              path: ["direction", "y"],
              data: characterEntity.direction.y,
              type: DataLayer.UpdateType.SimpleInject,
            },
            {
              path: ["direction", "z"],
              data: characterEntity.direction.z,
              type: DataLayer.UpdateType.SimpleInject,
            },
          ],
        },
      ],
    };
  }
}