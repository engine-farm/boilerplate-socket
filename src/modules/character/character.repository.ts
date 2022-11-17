import * as EngineFarm from "@engine-farm/sdk-types";
import { AbstractRepository } from "@engine-farm/sdk-types";
import { CharacterEntity } from "./character.entity";
import { GameState } from "../game-state";
import { CharacterTableConfig } from "./character.table-config";

export class CharacterModel {
  characterId?: string;
  userId: string;
  name: string;
  position?: {
    x: number;
    y: number;
    z: number;
  };
}

export class CharacterRepository {
  private static primaryKeyName = CharacterTableConfig.primaryKey;
  private static tableName = CharacterTableConfig.tableName;
  private static redisNamespace = "e:character";

  static get(characterId: string): Promise<CharacterModel> {
    return AbstractRepository.findOne<CharacterModel>(this.tableName, {
      characterId,
    });
  }

  static async create(data: Pick<CharacterModel, "userId" | "name">) {
    const exists = await this.findByName(data.name);
    if (exists) {
      return Promise.reject("Already exists");
    }
    return AbstractRepository.insert<CharacterModel>(
      this.tableName,
      data,
      this.primaryKeyName
    );
  }

  static findByName(name: string) {
    return AbstractRepository.findOne<CharacterModel>(this.tableName, { name });
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
