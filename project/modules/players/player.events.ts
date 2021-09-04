import * as EngineFarm from "@engine-farm/sdk-types";
import { EventsGame } from "../../generated-types";
import { GameState } from "modules/game-state";
import { PlayerEventType } from "../../player-events.game";
import { CharacterRepository } from "../character/character.repository";
import { CharacterEntity } from "../character/character.entity";
import { UserManage } from "../../repositories/user.manage";

export const PlayerEvents: EngineFarm.EndpointLayer.DefinePlayerEvent[] = [
  new EngineFarm.EndpointLayer.CreatePlayerEvent<GameState>(
    "PlayerSelectCharacter",
    PlayerEventType.PlayerSelectCharacter,
    {},
    {
      characterId: EngineFarm.EndpointLayer.PlayerEventDataKeyTypes.Number,
    },
    async (connection, sectorState, data, runAction) => {
      const selectetCharacterId = data.characterId as number;

      console.log("^^^^^^^^^^^^^^^^^^^^^ PlayerSelectCharacter event action");
      const player = sectorState.players.get(connection.userId);
      if (player) {
        // remove from state characters old state (if not null)
        if (
          player.characterId &&
          sectorState.characters.has(player.characterId)
        ) {
          sectorState.characters.delete(player.characterId);
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

          // update in state characterId
          player.characterId = selectetCharacterId;

          // update database characterId
          await UserManage.update(player.userId, {
            selectedIds: { characterId: selectetCharacterId },
          });

          // add tasks to sector
          runAction({
            addActions: [
              
            ],
          })
        }
      }
    }
  ),
];
