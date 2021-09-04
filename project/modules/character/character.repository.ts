import * as EngineFarm from "@engine-farm/sdk-types";
import { GameState } from "modules/game-state";
import { CharacterEntity } from "./character.entity";

export class CharacterModel {
  characterId: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
}

const FakeDBCharacters: { [index: number]: CharacterModel } = {
  1: {
    characterId: 1,
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
  },
};

export class CharacterRepository {
  private static redisNamespace = "e:character";

  static get(characterId: number): Promise<CharacterModel> {
    return EngineFarm.BaseManager.get(this.redisNamespace, characterId);
  }

  static set(characterId: number, data: CharacterModel) {
    console.log(
      "[(" + process.env["CONTEXT"] + ") CharacterRepository::set]",
      characterId,
      data
    );
    return EngineFarm.BaseManager.set(this.redisNamespace, characterId, data);
  }

  static update(characterId: number, data: Partial<CharacterModel>) {
    return EngineFarm.BaseManager.update(
      this.redisNamespace,
      characterId,
      data
    );
  }

  static loadToState(characterId: number, gameState: GameState) {
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

console.log({FakeDBCharacters})

Object.values(FakeDBCharacters).forEach((character) => {
  CharacterRepository.set(character.characterId, character);
});
