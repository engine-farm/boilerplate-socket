import { EndpointLayer, EngineLayer } from "@engine-farm/sdk-types";
import { GameState } from "../../game-state";
import { PlayerEventType } from "../../../player-events.game";
import PlayerEventDataFormat = EndpointLayer.PlayerEventDataFormat;

export class CharacterShootingEvent
  implements
    EndpointLayer.PlayerEventAction<GameState>,
    EndpointLayer.DefinePlayerEvent<GameState>
{
  name = "CharacterShooting";
  type = PlayerEventType.CharacterShooting;
  data: EndpointLayer.DefinePLayerEventSchema = {
    mouse: {
      type: EndpointLayer.PlayerEventDataKeyTypes.Enum,
      valueType: PlayerEventDataFormat.SingleValue,
      enumName: "MouseEvent",
    },
  };

  enums = {
    MouseEvent: ["LBMDown", "LBMUp", "RBMDown", "RBMUp"],
  };

  onAction(
    connection: EndpointLayer.NetworkConnectionInterface,
    sectorState: GameState,
    data: { [p: string]: any },
    runAction?: EngineLayer.EngineActionCallback
  ) {}
}
