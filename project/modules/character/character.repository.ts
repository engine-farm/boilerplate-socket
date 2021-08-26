import * as EngineFarm from "@engine-farm/sdk-types";

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
            x: 0, y: 0, z: 0
        }
    }
}

export class CharacterRepository {

    private static redisNamespace = 'e:character';

    static get(characterId: number): Promise<CharacterModel> {
        return EngineFarm.BaseManager.get(this.redisNamespace, characterId);
    }

    static set(characterId: number, data: CharacterModel) {
        return EngineFarm.BaseManager.set(this.redisNamespace, characterId, data);
    }

    static update(characterId: number, data: Partial<CharacterModel>) {
        return EngineFarm.BaseManager.update(this.redisNamespace, characterId, data);
    }
}

Object.values(FakeDBCharacters).forEach((platform) => {
    CharacterRepository.set(platform.characterId, platform)
})
