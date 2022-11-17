import { EndpointLayer, EngineLayer, NetworkLayer, UserManage } from '@engine-farm/sdk-types';
import { GameState } from "../../game-state";
import { PlayerEventType } from "../../../player-events.game";
import { CharacterRepository } from '../../character/character.repository';
import { CharacterEntity } from '../../character/character.entity';
import { PlayerRepository } from '../player.repository';
import { EventsGame } from '../../../generated-types';

export class PlayerSelectCharacterEvent
  implements
    EndpointLayer.PlayerEventAction<GameState>,
    EndpointLayer.DefinePlayerEvent<GameState>
{
  name = "PlayerSelectCharacter";
  type = PlayerEventType.PlayerSelectCharacter;
  enums = {};
  data = {
    characterId: EndpointLayer.PlayerEventDataKeyTypes.String,
  };

  async onAction(
    connection: EndpointLayer.NetworkConnectionInterface,
    sectorState: GameState,
    data: { [p: string]: any },
    runAction: EngineLayer.EngineActionCallback | undefined
  ): Promise<void> {

    const selectetCharacterId = data.characterId as string;

    console.log("^^^^^^^^^^^^^^^^^^^^^ PlayerSelectCharacter event action");
    const player = sectorState.players.get(connection.userId);
    if (player) {
      // remove from state characters old state (if not null)
      let removedCharacterId;
      if (
        player.characterId &&
        sectorState.characters.has(player.characterId)
      ) {
        sectorState.characters.delete(player.characterId);
        removedCharacterId = player.characterId;
      }

      // get from database
      const characterEntity = await CharacterRepository.get(
        selectetCharacterId
      );
      if (characterEntity) {
        const characterState = new CharacterEntity({
          characterId: characterEntity.characterId,
          position: {
            x: characterEntity.position.x,
            y: characterEntity.position.y,
            z: characterEntity.position.z,
          },
        });

        // create instance character in state
        sectorState.characters.set(selectetCharacterId, characterState);

        // update in state characterId
        sectorState.players.update(connection.userId, [
          [["characterId"], selectetCharacterId],
        ]);

        // update database characterId
        await UserManage.update(player.userId, {

        })
        await PlayerRepository.update(player.userId, {
          selectedIds: { characterId: selectetCharacterId },
        });


        // add tasks to sector
        runAction({
          addActions: [
            // removedCharacterId ? {} : {},
            {
              payload: data,
              timing: {
                type: NetworkLayer.Events.SectorEvents
                  .ObjectActionTimingType.MaxDelay,
                ms: 2000,
              },
              action: {
                operation: EngineLayer.EngineActionOperation.Add,
                type: EventsGame.GeneratedActions.CharacterMovement,
              },
              engineObject: {
                type: EngineLayer.ObjectTypeManager.getByEntity(
                  CharacterEntity
                ),
                elementId: player.characterId,
              },
            },
          ],
        });
      }
    }
  }
}