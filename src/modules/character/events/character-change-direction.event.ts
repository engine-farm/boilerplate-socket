import {
  EndpointLayer,
  EngineLayer,
  NetworkLayer,
} from '@engine-farm/sdk-types';
import { GameState } from '../../game-state';
import { PlayerEventType } from '../../../player-events.game';
import { EventsGame } from '../../../generated-types';
import { CharacterEntity } from '../character.entity';

export class CharacterChangeDirectionEvent
  implements
    EndpointLayer.PlayerEventAction<GameState>,
    EndpointLayer.DefinePlayerEvent<GameState>
{
  name = 'CharacterChangeDirection';
  type = PlayerEventType.CharacterChangeDirection;
  enums = {};
  data = {
    x: EndpointLayer.PlayerEventDataKeyTypes.Number,
    y: EndpointLayer.PlayerEventDataKeyTypes.Number,
    z: EndpointLayer.PlayerEventDataKeyTypes.Number,
  };

  onAction(connection, sectorState: GameState, data, runAction) {
    console.log(
      '^^^^^^^^^^^^^^^^^^^^^ CharacterChangeDirection event action',
      data
    );
    const player = sectorState.players.get(connection.userId);
    console.log(
      '^^^^^^^^^^^^^^^^^^^^^ CharacterChangeDirection event action player',
      player,
      typeof player
    );
    if (player.characterId) {
      runAction({
        addActions: [
          {
            payload: data,
            timing: {
              type: NetworkLayer.Events.SectorEvents.ObjectActionTimingType
                .OneTime,
            },
            action: {
              operation: EngineLayer.EngineActionOperation.Add,
              type: EventsGame.GeneratedActions.CharacterChangeDirection,
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
