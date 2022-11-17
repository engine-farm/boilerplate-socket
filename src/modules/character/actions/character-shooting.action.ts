import { EventsGame } from "../../../generated-types";
import { EngineLayer } from "@engine-farm/sdk-types";
import { GameState } from "../../game-state";
import { CharacterEntity } from "../character.entity";

type CharacterShootingData =
  EventsGame.GeneratedEventsBody[EventsGame.GeneratedEventsTypesGame.CharacterShooting]["data"];

export class CharacterShootingAction
  implements
    EngineLayer.IAction<GameState, CharacterEntity, CharacterShootingData>
{
  name = "CharacterShooting";

  onAction(
    payload: EngineLayer.IActionPayload<
      GameState,
      CharacterEntity,
      CharacterShootingData
    >
  ): EngineLayer.EngineActionReturnType {
    return undefined;
  }
}
