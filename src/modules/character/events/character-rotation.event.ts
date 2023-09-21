import { PlayerEventType } from '../../../player-events.game';
import { EndpointLayer, EngineLayer } from '@engine-farm/sdk-types';
import { GameState } from '../../game-state';

export class CharacterRotationEvent
  implements
    EndpointLayer.DefinePlayerEvent<GameState>,
    EndpointLayer.PlayerEventAction<GameState>
{
  name = 'CharacterRotation';
  type = PlayerEventType.CharacterRotation;
  data = {
    x: EndpointLayer.PlayerEventDataKeyTypes.Number,
    y: EndpointLayer.PlayerEventDataKeyTypes.Number,
    z: EndpointLayer.PlayerEventDataKeyTypes.Number,
  };
  enums = {};

  onAction(
    connection: EndpointLayer.NetworkConnectionInterface,
    sectorState: GameState,
    data: { [index: string]: any },
    runAction?: EngineLayer.EngineActionCallback<any>
  ) {
    return null;
  }
}
