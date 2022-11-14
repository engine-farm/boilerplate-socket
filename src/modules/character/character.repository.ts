import * as EngineFarm from "@engine-farm/sdk-types";
import { AbstractRepository } from "@engine-farm/sdk-types";
import { CharacterEntity } from "./character.entity";
import { GameState } from "../game-state";
import { PlayerTableConfig } from "../players/player.table-config";

export class CharacterModel {
  characterId?: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
}

export class CharacterRepository {
  private static tableName = PlayerTableConfig.tableName;
  private static redisNamespace = "e:character";

  static get(characterId: string): Promise<CharacterModel> {
    return AbstractRepository.findOne<CharacterModel>(this.tableName, {
      characterId,
    });
  }

  static set(characterId: string, data: CharacterModel) {
    console.log(
      "[(" + process.env["CONTEXT"] + ") CharacterRepository::set]",
      characterId,
      data
    );
    return EngineFarm.RedisManager.set(this.redisNamespace, characterId, data);
  }

  static update(characterId: string, data: Partial<CharacterModel>) {
    return EngineFarm.RedisManager.update(
      this.redisNamespace,
      characterId,
      data
    );
  }

  static loadToState(characterId: string, gameState: GameState) {
    return this.get(characterId).then((character) => {
      if (!gameState.characters.has(characterId)) {
        return gameState.characters.set(
          characterId,
          new CharacterEntity({
            metadata: {},
            elementId: characterId,
          })
        );
      } else {
        return gameState.characters.get(characterId);
      }
    });
  }
}
