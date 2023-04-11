import { GameState } from "../../game-state";
import { PlayerEventType } from "../../../player-events.game";
import { EventsGame } from "../../../generated-types";
import { CharacterEntity } from "../character.entity";
import {
  EndpointLayer,
  EngineLayer,
  NetworkLayer,
} from "@engine-farm/sdk-types";
import PlayerEventDataKeyTypes = EndpointLayer.PlayerEventDataKeyTypes;

export class CharacterMovementEvent
  implements
    EndpointLayer.PlayerEventAction<GameState>,
    EndpointLayer.DefinePlayerEvent<GameState>
{
  name = "CharacterMovement";
  type = PlayerEventType.CharacterMovement;

  enums = {
    Directions: ["Forward", "Backward", "Left", "Right", "Up", "Down", "Jump"],
  };

  data: EndpointLayer.DefinePLayerEventSchema = {
    state: EndpointLayer.PlayerEventDataKeyTypes.Boolean,
    directions: {
      type: PlayerEventDataKeyTypes.Enum,
      enumName: "Directions",
      valueType: EndpointLayer.PlayerEventDataFormat.MultiValues,
    },
  };

  onAction(
    connection: EndpointLayer.NetworkConnectionInterface,
    sectorState,
    data,
    runAction: EngineLayer.EngineActionCallback | undefined
  ): void {
    const player = sectorState.players.get(connection.userId);
    if (player.characterId) {
      runAction({
        addActions: [
          {
            payload: data,
            timing: {
              type: NetworkLayer.Events.SectorEvents.ObjectActionTimingType
                .MaxDelay,
              ms: 4000,
            },
            action: {
              operation: data.state
                ? EngineLayer.EngineActionOperation.Add
                : EngineLayer.EngineActionOperation.Remove,
              type: EventsGame.GeneratedActions.CharacterMovement,
            },
            engineObject: {
              type: EngineLayer.ObjectTypeManager.getByEntity(CharacterEntity),
              elementId: player.characterId,
            },
          },
        ],
      });
    }
  }
}
